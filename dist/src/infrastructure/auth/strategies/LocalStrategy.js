"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = void 0;
const passport_local_1 = require("passport-local");
const bcrypt = __importStar(require("bcrypt"));
const localStrategy = (repository) => {
    const options = {
        usernameField: "email",
        passwordField: "password",
        session: false,
    };
    const verify = (email, password, done) => {
        repository
            .findByEmail(email)
            .then((user) => {
            var _a;
            if (!user) {
                return done(null, false);
            }
            return bcrypt.compare(password, (_a = user.password_hash) !== null && _a !== void 0 ? _a : "").then((ok) => {
                if (!ok) {
                    return done(null, false);
                }
                done(null, user);
            });
        })
            .catch((err) => {
            done(err);
        });
    };
    return new passport_local_1.Strategy(options, verify);
};
exports.localStrategy = localStrategy;
