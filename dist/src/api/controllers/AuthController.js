"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const passport_1 = __importDefault(require("passport"));
// No need for the TokenPayload import
const AuthService_1 = require("../../application/services/AuthService");
const CustomerService_1 = require("../../application/services/CustomerService");
const EmployeeService_1 = require("../../application/services/EmployeeService");
const types_1 = require("../../shared/di/types");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const database_config_1 = __importDefault(require("../../infrastructure/config/database.config"));
const google_auth_library_1 = require("google-auth-library");
const googleClient = new google_auth_library_1.OAuth2Client();
let AuthController = class AuthController {
    constructor(authService, customerService, employeeService) {
        this.authService = authService;
        this.customerService = customerService;
        this.employeeService = employeeService;
        this.delete = [
            AuthMiddleware_1.authenticateJWT,
            (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.authService.deleteUser(req.params.userId);
                    res.sendStatus(204);
                }
                catch (err) {
                    next(err);
                }
            }),
        ];
        this.refresh = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: "refreshToken is required" });
            }
            try {
                const tokens = this.authService.refreshToken(refreshToken);
                return res.json(tokens);
            }
            catch (err) {
                return res
                    .status(401)
                    .json({ error: err instanceof Error ? err.message : "Invalid token" });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email, password } = req.body;
                if (!firstName || !lastName || !email || !password) {
                    return res.status(400).json({
                        error: "firstName, lastName, email and password are required",
                    });
                }
                const user = yield this.authService.register(firstName, lastName, email, password);
                yield this.customerService.createCustomer(user.id, {
                    authUserId: user.id,
                });
                res.status(201).json({ id: user.id, email: user.email });
            }
            catch (err) {
                res.status(400).json({
                    error: err instanceof Error ? err.message : "Unknown error",
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res
                        .status(400)
                        .json({ error: "Email and password are required" });
                }
                const tokens = yield this.authService.login(email, password);
                const user = yield this.authService.findUserByEmail(email);
                const profile = {};
                try {
                    profile.employee = yield this.employeeService.findByAuthUserId(tokens.userId);
                }
                catch (_a) {
                    try {
                        profile.customer = yield this.customerService.findByAuthUserId(tokens.userId);
                    }
                    catch (_b) {
                        /* neither employee nor customer: leave profile empty */
                    }
                }
                return res.json(Object.assign({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user }, profile));
            }
            catch (err) {
                return res.status(400).json({
                    error: err instanceof Error ? err.message : "Invalid credentials",
                });
            }
        });
    }
    googleAuth() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!database_config_1.default.isInitialized)
                yield database_config_1.default.initialize();
            const state = req.query.redirect_uri
                ? Buffer.from(JSON.stringify({ redirect_uri: req.query.redirect_uri })).toString('base64')
                : undefined;
            passport_1.default.authenticate('google', {
                scope: ['profile', 'email'],
                state,
                accessType: 'offline',
                prompt: 'consent'
            })(req, res, next);
        });
    }
    googleAuthNative(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken } = req.body;
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
                const googleClient = new google_auth_library_1.OAuth2Client();
                // جرب التحقق مع كل Client ID
                let ticket = null;
                let usedClientId = '';
                for (const audience of audiences) {
                    try {
                        console.log(`جاري تجربة Client ID: ${audience}`);
                        ticket = yield googleClient.verifyIdToken({
                            idToken,
                            audience: audience,
                        });
                        usedClientId = audience;
                        console.log(`✅ نجح التحقق مع Client ID: ${audience}`);
                        break;
                    }
                    catch (error) {
                        console.log(`❌ فشل مع ${audience}:`, error.message);
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
                const firstName = given_name || (name === null || name === void 0 ? void 0 : name.split(' ')[0]) || '';
                const lastName = family_name || (name === null || name === void 0 ? void 0 : name.split(' ').slice(1).join(' ')) || '';
                const displayName = name || [given_name, family_name].filter(Boolean).join(" ");
                const tokens = yield this.authService.loginWithGoogle({
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
                    const customer = yield this.customerService.findByAuthUserId(tokens.userId);
                    // Check if required profile fields are filled
                    const requiredFields = [
                        'firstName', 'lastName', 'email', 'phoneNumber',
                        'nationality', 'passportNumber', 'addressLine1', 'city', 'country'
                    ];
                    profileCompleted = requiredFields.every(field => {
                        const value = customer[field];
                        return value !== undefined && value !== null && value !== '';
                    });
                    // Check if location data exists
                    hasLocation = !!(customer.latitude && customer.longitude);
                }
                catch (error) {
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
            }
            catch (err) {
                return res.status(400).json({ error: "Invalid Google token" });
            }
        });
    }
    googleAuthCallback() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!database_config_1.default.isInitialized)
                yield database_config_1.default.initialize();
            passport_1.default.authenticate("google", { session: false, failureRedirect: "/login" }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err || !user)
                        return res.redirect(`/login?error=authentication_failed`);
                    const tokens = yield this.authService.loginWithGoogle(user);
                    const redirectUrl = new URL("/auth/success", process.env.FRONTEND_URL || "http://localhost:3000");
                    redirectUrl.searchParams.set("token", tokens.accessToken);
                    if (tokens.refreshToken)
                        redirectUrl.searchParams.set("refresh_token", tokens.refreshToken);
                    res.redirect(redirectUrl.toString());
                }
                catch (e) {
                    res.redirect(`/login?error=server_error`);
                }
            }))(req, res, next);
        });
    }
    otp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("phone", { session: false }, (err, user, info) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (!user) {
                    const msg = (info === null || info === void 0 ? void 0 : info.message) || "Authentication failed";
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
            })(req, res, next);
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AuthService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CustomerService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.EmployeeService)),
    __metadata("design:paramtypes", [AuthService_1.AuthService,
        CustomerService_1.CustomerService,
        EmployeeService_1.EmployeeService])
], AuthController);
