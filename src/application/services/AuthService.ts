import { v4 as uuid } from "uuid";
import { inject, injectable } from "inversify";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import { IOtpRepository } from "../../core/interfaces/repositories/IOtpRepository";
import { AuthUser } from "../../core/entities/Auth";
import { TokenPair } from "../../core/value-objects/Token";
import { IAppConfig } from "../../core/config/IAppConfig";
import { SmsService } from "../../infrastructure/sms/SmsService";
import { CustomerService } from "./CustomerService";
import { TYPES } from "../../shared/di/types";
import { Otp } from "../../core/entities/Otp";
import { TooManyOtpRequestsError } from "../exceptions/TooManyOtpRequestsError";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repository: IAuthRepository,
    @inject(TYPES.Config) private readonly config: IAppConfig,
    @inject(TYPES.OtpRepository) private readonly otpRepo: IOtpRepository,
    @inject(TYPES.SmsService) private readonly smsSvc: SmsService,
    @inject(TYPES.CustomerService) private readonly customerSvc: CustomerService
  ) {}

  private generateId(): string {
    return uuid();
  }

  public generateJwt(user: AuthUser): string {
    return jwt.sign({ userId: user.id }, this.config.JWT_SECRET, {
      expiresIn: "15m",
    });
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthUser> {
    const exists = await this.repository.findByEmail(email);
    if (exists) throw new Error("User already exists");
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const user = new AuthUser(
      this.generateId(),
      firstName,
      lastName,
      email,
      "local",
      password_hash
    );
    await this.repository.create(user);
    return user;
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.repository.findByEmail(email);
    if (!user || !user.password_hash) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error("Invalid credentials");
    return this.generateTokens(user);
  }

  refreshToken(refreshToken: string): TokenPair {
    const payload = jwt.verify(
      refreshToken,
      this.config.JWT_REFRESH_SECRET
    ) as { userId: string };
    const stubUser = new AuthUser(payload.userId, "", "", null, "local");
    return this.generateTokens(stubUser);
  }

  private generateTokens(user: AuthUser): TokenPair {
    const access = jwt.sign({ userId: user.id }, this.config.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign(
      { userId: user.id },
      this.config.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    return new TokenPair(access, refresh, user.id);
  }

  async findOrCreateByPhone(phone: string): Promise<AuthUser> {
    let user = await this.repository.findByPhoneNumber(phone);
    if (!user) {
      const id = this.generateId();
      user = new AuthUser(
        id,
        "",
        "",
        null,
        "phone",
        undefined,
        undefined,
        false,
        undefined,
        undefined,
        phone
      );
      await this.repository.create(user);
      await this.customerSvc.createCustomer(id, {
        authUserId: user.id,
      });
    }
    return user;
  }

  public async findUserByEmail(email: string): Promise<AuthUser> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user;
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.repository.delete(userId);
  }

  async loginWithGoogle(googleUser: {
    id: string;
    email: string;
    displayName: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
    locale?: string;
    gender?: string;
  }): Promise<TokenPair> {
    try {
      // Find existing user by email or create a new one
      const email = googleUser.email;
      let user = await this.repository.findByEmail(email);
      
      // Extract name parts from Google user data
      const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || '';
      const lastName = googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';
      const fullName = googleUser.name || googleUser.displayName || `${firstName} ${lastName}`.trim();
      
      if (!user) {
        // Create new user from Google profile
        user = new AuthUser(
          this.generateId(),
          firstName,
          lastName,
          email,
          'google',
          undefined, // No password for OAuth users
          googleUser.id, // Google ID as provider_id
          true, // Email is verified by Google
          firstName,
          lastName
        );
        
        await this.repository.create(user);
      } else if (user.provider !== 'google' || !user.provider_id) {
        // Update existing user with Google provider info if needed
        user.provider = 'google';
        user.provider_id = googleUser.id;
        await this.repository.update(user);
      }

      // Check if customer exists
      let customerExists = true;
      try {
        await this.customerSvc.findByAuthUserId(user.id);
      } catch (error) {
        customerExists = false;
      }

      // If customer doesn't exist, create one
      if (!customerExists) {
        const customerData = {
          authUserId: user.id,
          customername: fullName,
          email: email,
          phoneNumber: user.phoneNumber || '',
          customerType: 'Regular' as const,
          firstName: firstName || 'User',
          lastName: lastName || '',
          profilePicture: googleUser.picture,
          locale: googleUser.locale,
          gender: googleUser.gender,
          nationality: 'Unknown',
          passportNumber: '',
          addressLine1: '',
          city: '',
          country: '',
          registrationDate: new Date().toISOString().split('T')[0]
        };

        try {
          await this.customerSvc.createCustomer(user.id, customerData);
        } catch (error) {
          console.error('Error creating customer profile:', error);
          // Continue with login even if customer profile creation fails
        }
      }

      // Generate tokens
      return this.generateTokens(user);
    } catch (error) {
      console.error('Error in loginWithGoogle:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  async sendOtp(userId: string, phone: string): Promise<void> {
    const now = Date.now();
    const HOUR = 60 * 60 * 1000;
    const since = new Date(now - HOUR);
    const recent = await this.otpRepo.listRequestsSince(userId, since);
    if (recent.length >= 5) {
      const oldest = recent[0].createdAt.getTime();
      const retryMs = Math.max(0, oldest + HOUR - now);
      throw new TooManyOtpRequestsError(retryMs);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(code, await bcrypt.genSalt());
    const expiresAt = new Date(now + 5 * 60 * 1000);
    const createdAt = new Date(now);

    await this.otpRepo.create(
      new Otp(this.generateId(), userId, hash, expiresAt, createdAt)
    );
    await this.smsSvc.sendSms(phone, `Your login code is: ${code}`);
  }

  async verifyOtp(userId: string, code: string): Promise<void> {

    
    const cands = await this.otpRepo.findValid(userId);
    for (const otp of cands) {
      if (await bcrypt.compare(code, otp.hash)) {
        await Promise.all(cands.map((o) => this.otpRepo.delete(o.id)));
        const user = await this.repository.findById(userId);
        if (user) {
          user.phoneVerified = true;
          await this.repository.update(user);
        }
        return;
      }
    }
    throw new Error("Invalid or expired code");
  }
}
