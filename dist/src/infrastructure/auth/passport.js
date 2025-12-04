"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const LocalStrategy_1 = require("./strategies/LocalStrategy");
const GoogleStrategy_1 = require("./strategies/GoogleStrategy");
const PhoneStrategy_1 = require("./strategies/PhoneStrategy");
const initializePassport = (authRepository, authService) => {
    passport_1.default.use((0, LocalStrategy_1.localStrategy)(authRepository));
    passport_1.default.use((0, GoogleStrategy_1.googleStrategy)(authRepository));
    passport_1.default.use((0, PhoneStrategy_1.phoneStrategy)(authService));
};
exports.initializePassport = initializePassport;
