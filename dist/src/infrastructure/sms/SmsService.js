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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const inversify_1 = require("inversify");
const server_sdk_1 = require("@vonage/server-sdk");
const auth_1 = require("@vonage/auth");
let SmsService = class SmsService {
    constructor() {
        const apiKey = process.env.VONAGE_API_KEY;
        const apiSecret = process.env.VONAGE_API_SECRET;
        const brand = process.env.VONAGE_BRAND_NAME || "YourApp";
        const auth = new auth_1.Auth({ apiKey, apiSecret });
        this.vonage = new server_sdk_1.Vonage(auth);
        this.from = brand;
    }
    sendSms(to, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.vonage.sms.send({ to, from: this.from, text });
            const msg = (_a = response.messages) === null || _a === void 0 ? void 0 : _a[0];
            if (msg && msg.status !== "0") {
                throw new Error(`Vonage SMS error ${msg.status}: ${msg.errorText}`);
            }
        });
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
