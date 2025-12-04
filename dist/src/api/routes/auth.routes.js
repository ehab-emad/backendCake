"use strict";
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
const express_1 = __importDefault(require("express"));
const container_1 = require("../../shared/di/container");
const types_1 = require("../../shared/di/types");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
const authController = container_1.container.get(types_1.TYPES.AuthController);
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authController.register(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/google/native", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authController.googleAuthNative(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authController.login(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/otp", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authController.otp(req, res, next);
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:userId", AuthMiddleware_1.authenticateJWT, ...authController.delete);
router.get("/google", authController.googleAuth());
router.get("/google/callback", authController.googleAuthCallback());
router.get("/profile", AuthMiddleware_1.authenticateJWT, (req, res) => {
    res.json(req.user);
});
router.post("/refresh", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authController.refresh(req, res);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
