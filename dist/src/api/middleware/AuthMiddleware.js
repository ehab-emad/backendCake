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
exports.authenticateJWT = authenticateJWT;
const jwt = __importStar(require("jsonwebtoken"));
const container_1 = require("../../shared/di/container");
const types_1 = require("../../shared/di/types");
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined.");
    }
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (_a) {
        res.sendStatus(403);
        return;
    }
    const authRepo = container_1.container.get(types_1.TYPES.AuthRepository);
    authRepo
        .findById(payload.userId)
        .then((user) => {
        if (!user) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    })
        .catch((err) => next(err));
}
