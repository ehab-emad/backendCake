import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import passport from "passport";
// No need for the TokenPayload import
import { AuthService } from "../../application/services/AuthService";
import { CustomerService } from "../../application/services/CustomerService";
import { EmployeeService } from "../../application/services/EmployeeService";
import { TYPES } from "../../shared/di/types";
import { AuthUser } from "../../core/entities/Auth";
import { Employee } from "../../core/entities/Employee";
import { Customer } from "../../core/entities/Customer";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import AppDataSource from "../../infrastructure/config/database.config";
import { OAuth2Client } from "google-auth-library";


const googleClient = new OAuth2Client();

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,

    @inject(TYPES.CustomerService)
    private readonly customerService: CustomerService,

    @inject(TYPES.EmployeeService)
    private readonly employeeService: EmployeeService
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          error: "firstName, lastName, email and password are required",
        });
      }

      const user = await this.authService.register(
        firstName,
        lastName,
        email,
        password
      );

      await this.customerService.createCustomer(user.id, {
        authUserId: user.id,
      });

      res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const tokens = await this.authService.login(email, password);
      const user = await this.authService.findUserByEmail(email);

      const profile: { employee?: Employee; customer?: Customer } = {};
      try {
        profile.employee = await this.employeeService.findByAuthUserId(
          tokens.userId
        );
      } catch {
        try {
          profile.customer = await this.customerService.findByAuthUserId(
            tokens.userId
          );
        } catch {
          /* neither employee nor customer: leave profile empty */
        }
      }

      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
        ...profile,
      });
    } catch (err) {
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Invalid credentials",
      });
    }
  }

  public delete = [
    authenticateJWT,
    async (
      req: Request<{ userId: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await this.authService.deleteUser(req.params.userId);
        res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    },
  ];

  googleAuth() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();

      const state = req.query.redirect_uri
        ? Buffer.from(JSON.stringify({ redirect_uri: req.query.redirect_uri })).toString('base64')
        : undefined;

      passport.authenticate('google', {
        scope: ['profile', 'email'],
        state,
        accessType: 'offline',
        prompt: 'consent'
      })(req, res, next);
    };
  }

  async googleAuthNative(req: Request, res: Response) {
    try {
      const { idToken } = req.body as { idToken?: string };
      if (!idToken) {
        return res.status(400).json({ error: "idToken is required" });
      }

      // احصل على قائمة Client IDs من البيئة (دعم المتغيرات المختلفة)
      const clientIdsString = process.env.GOOGLE_CLIENT_IDS ||
                             [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_ANDROID_CLIENT_ID, process.env.GOOGLE_IOS_CLIENT_ID]
                               .filter(Boolean).join(',');
      const audiences = clientIdsString.split(',').map(id => id.trim()).filter(Boolean);

      if (audiences.length === 0) {
        console.error('❌ لا توجد Google Client IDs في متغيرات البيئة');
        return res.status(500).json({
          error: "Server configuration error",
          message: "يرجى تحديد GOOGLE_CLIENT_IDS في متغيرات البيئة"
        });
      }

      console.log('🔍 محاولة التحقق من التوكين...');
      console.log('Client IDs المحددة:', audiences);
      console.log('طول التوكين:', idToken.length);

      const googleClient = new OAuth2Client();

      // جرب التحقق مع كل Client ID
      let ticket: any = null;
      let usedClientId = '';

      for (const audience of audiences) {
        try {
          console.log(`جاري تجربة Client ID: ${audience}`);
          ticket = await googleClient.verifyIdToken({
            idToken,
            audience: audience,
          });

          usedClientId = audience;
          console.log(`✅ نجح التحقق مع Client ID: ${audience}`);
          break;

        } catch (error) {
          console.log(`❌ فشل مع ${audience}:`, (error as Error).message);
          continue;
        }
      }

      if (!ticket) {
        return res.status(400).json({
          error: "Invalid Google token",
          message: "التوكين غير صالح أو انتهت صلاحيته",
          clientIds: audiences
        });
      }

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      // استخراج بيانات المستخدم
      const { email, email_verified, sub, name, given_name, family_name, picture } = payload;

      if (!email || email_verified !== true) {
        return res.status(400).json({
          error: "Email not verified by Google",
          message: "يرجى التحقق من صحة البريد الإلكتروني"
        });
      }

      console.log('✅ تم التحقق بنجاح:', { email, name, clientId: usedClientId });

      const firstName = given_name || name?.split(' ')[0] || '';
      const lastName = family_name || name?.split(' ').slice(1).join(' ') || '';
      const displayName = name || [given_name, family_name].filter(Boolean).join(" ");
      
      const tokens = await this.authService.loginWithGoogle({
        id: sub,
        email,
        displayName,
        given_name: firstName,
        family_name: lastName,
        name: displayName,
        picture: payload.picture,
        locale: payload.locale
      });

      // Get customer profile to check completion status
      let profileCompleted = false;
      let hasLocation = false;
      
      try {
        const customer = await this.customerService.findByAuthUserId(tokens.userId);
        
        // Check if required profile fields are filled
        const requiredFields = [
          'firstName', 'lastName', 'email', 'phoneNumber',
          'nationality', 'passportNumber', 'addressLine1', 'city', 'country'
        ];
        
        profileCompleted = requiredFields.every(field => {
          const value = (customer as any)[field];
          return value !== undefined && value !== null && value !== '';
        });
        
        // Check if location data exists
        hasLocation = !!(customer.latitude && customer.longitude);
      } catch (error) {
        // If customer not found or any error, profile is not complete
        profileCompleted = false;
        hasLocation = false;
      }

      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: tokens.userId,
        profileCompleted,
        hasLocation
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid Google token" });
    }
  }

  googleAuthCallback() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();

      passport.authenticate("google", { session: false, failureRedirect: "/login" }, async (err: Error, user: any) => {
        try {
          if (err || !user) return res.redirect(`/login?error=authentication_failed`);
          const tokens = await this.authService.loginWithGoogle(user);
          const redirectUrl = new URL("/auth/success", process.env.FRONTEND_URL || "http://localhost:3000");
          redirectUrl.searchParams.set("token", tokens.accessToken);
          if (tokens.refreshToken) redirectUrl.searchParams.set("refresh_token", tokens.refreshToken);
          res.redirect(redirectUrl.toString());
        } catch (e) {
          res.redirect(`/login?error=server_error`);
        }
      })(req, res, next);
    };
  }
  async otp(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "phone",
      { session: false },
      (
        err: Error | null,
        user: AuthUser | false,
        info?: { message?: string }
      ) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!user) {
          const msg = info?.message || "Authentication failed";
          if (msg === "OTP sent") {
            return res.status(200).json({ message: msg });
          }
          if (msg.startsWith("Too many OTP")) {
            const m = msg.match(/Try again in (\d+)/);
            if (m) {
              const seconds = parseInt(m[1], 10) * 1;
              res.set("Retry-After", seconds.toString());
            }
            return res.status(429).json({ message: msg });
          }
          return res.status(400).json({ message: msg });
        }
        const accessToken = this.authService.generateJwt(user);
        return res.json({ accessToken });
      }
    )(req, res, next);
  }

  public refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }
    try {
      const tokens = this.authService.refreshToken(refreshToken);
      return res.json(tokens);
    } catch (err) {
      return res
        .status(401)
        .json({ error: err instanceof Error ? err.message : "Invalid token" });
    }
  };
}
