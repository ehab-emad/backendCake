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
exports.TamaraService = void 0;
const inversify_1 = require("inversify");
const axios_1 = __importDefault(require("axios"));
const TamaraOrder_dto_1 = require("../dto/TamaraOrder.dto");
const types_1 = require("../../shared/di/types");
const client_1 = require("../../infrastructure/tamara/client");
let TamaraService = class TamaraService {
    constructor(cfg) {
        this.cfg = cfg;
        this.client = new client_1.TamaraClient();
        this.baseUrl = cfg.TAMARA_BASE_URL;
        this.apiToken = cfg.TAMARA_API_TOKEN;
    }
    mapAddress(addr) {
        return Object.assign(Object.assign({ first_name: addr.firstName, last_name: addr.lastName, line1: addr.line1 }, (addr.line2 && { line2: addr.line2 })), { city: addr.city, region: addr.region, postal_code: addr.postalCode, country_code: addr.countryCode, phone_number: addr.phoneNumber });
    }
    createPaymentLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/checkout`;
            console.log('Tamara createPaymentLink payload:', JSON.stringify(payload, null, 2));
            const resp = yield axios_1.default.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            return { data: { redirect_url: resp.data.checkout_url || resp.data } };
        });
    }
    createOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = TamaraOrder_dto_1.CreateTamaraOrderSchema.parse(dto);
            const items = valid.items.map((i) => (Object.assign({ name: i.name, type: i.type, reference_id: i.referenceId, sku: i.sku, quantity: i.quantity, tax_amount: {
                    amount: i.taxAmount.amount,
                    currency: i.taxAmount.currency,
                }, unit_price: {
                    amount: i.unitPrice.amount,
                    currency: i.unitPrice.currency,
                }, total_amount: {
                    amount: i.totalAmount.amount,
                    currency: i.totalAmount.currency,
                }, item_url: i.itemUrl, image_url: i.imageUrl }, (i.discountAmount && {
                discount_amount: {
                    amount: i.discountAmount.amount,
                    currency: i.discountAmount.currency,
                },
            }))));
            const payload = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ total_amount: {
                    amount: valid.totalAmount.amount,
                    currency: valid.totalAmount.currency,
                }, shipping_amount: {
                    amount: valid.shippingAmount.amount || 0,
                    currency: valid.shippingAmount.currency,
                }, tax_amount: {
                    amount: valid.taxAmount.amount,
                    currency: valid.taxAmount.currency,
                }, order_reference_id: valid.orderReferenceId, order_number: valid.orderNumber }, (valid.discount && {
                discount: {
                    amount: {
                        amount: valid.discount.amount.amount,
                        currency: valid.discount.amount.currency,
                    },
                    name: valid.discount.name,
                },
            })), { items, consumer: {
                    email: valid.consumer.email,
                    first_name: valid.consumer.firstName,
                    last_name: valid.consumer.lastName,
                    phone_number: valid.consumer.phoneNumber,
                }, country_code: valid.countryCode, description: valid.description && valid.description.trim()
                    ? valid.description
                    : `Order ${valid.orderNumber}`, merchant_url: {
                    cancel: valid.merchantUrl.cancel,
                    failure: valid.merchantUrl.failure,
                    success: valid.merchantUrl.success,
                    notification: valid.merchantUrl.notification,
                }, payment_type: valid.paymentType === "FULL_PAYMENT"
                    ? "PAY_IN_FULL"
                    : valid.paymentType, instalments: valid.instalments, billing_address: this.mapAddress(valid.billingAddress), shipping_address: this.mapAddress(valid.shippingAddress) }), (valid.platform && { platform: valid.platform })), (valid.isMobile !== undefined && { is_mobile: valid.isMobile })), (valid.locale && { locale: valid.locale })), (valid.riskAssessment && { risk_assessment: valid.riskAssessment })), (valid.additionalData && { additional_data: valid.additionalData }));
            console.debug("Tamara createCheckout payload:", JSON.stringify(payload, null, 2));
            const resp = yield axios_1.default.post(`${this.baseUrl}/checkout`, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            return { checkoutUrl: resp.data.checkout_url || resp.data };
        });
    }
    cancelOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = dto.cancelReason ? { cancel_reason: dto.cancelReason } : {};
            yield this.client.cancelOrder(dto.orderId, {
                cancel_reason: (_a = dto.cancelReason) !== null && _a !== void 0 ? _a : "CUSTOMER_REQUEST",
                total_amount: {
                    amount: dto.amount,
                    currency: dto.currency
                }
            });
        });
    }
    //   public async captureOrder(orderId: string): Promise<void> {
    //   await this.client.captureOrder({ order_id: orderId });
    // }
    // public async getOrder(orderId: string): Promise<unknown> {
    //   const res = await this.client.getOrder(orderId);
    //   return res.data;
    // }
    // public async updateReference(orderId: string, body: { order_reference_id: string }): Promise<void> {
    //   await this.client.updateOrderReference(orderId, body);
    // }
    // public async captureOrder(dto: CaptureTamaraOrderDTO): Promise<void> {
    //   const {
    //     orderId,
    //     amount,
    //     currency,
    //     shippingAmount,
    //     taxAmount,
    //     discountAmount,
    //     description,
    //   } = dto;
    //   const body = {
    //     order_id: orderId,
    //     capture_amount: {
    //       amount,
    //       currency,
    //     },
    //     shipping_amount: shippingAmount ? { amount: shippingAmount, currency } : undefined,
    //     tax_amount: taxAmount ? { amount: taxAmount, currency } : undefined,
    //     discount_amount: discountAmount ? { amount: discountAmount, currency } : undefined,
    //     description,
    //   };
    //   // remove undefined values (clean object)
    //   const cleanedBody = JSON.parse(JSON.stringify(body));
    //   await this.client.captureOrder(cleanedBody);
    // }
    captureOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, amount, currency, shippingAmount, taxAmount, discountAmount, description, } = dto;
            const body = {
                order_id: orderId,
                capture_amount: { amount, currency },
                shipping_amount: shippingAmount ? { amount: shippingAmount, currency } : undefined,
                tax_amount: taxAmount ? { amount: taxAmount, currency } : undefined,
                discount_amount: discountAmount ? { amount: discountAmount, currency } : undefined,
                description,
            };
            const cleanedBody = JSON.parse(JSON.stringify(body));
            console.log("📦 Capture Order Body:", cleanedBody);
            yield this.client.captureOrder(cleanedBody);
        });
    }
    authoriseOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.authoriseOrder(orderId);
        });
    }
    refundOrder(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.simplifiedRefund(dto.orderId, Object.assign({ total_amount: {
                    amount: dto.amount,
                    currency: dto.currency,
                }, comment: dto.comment }, (dto.reason && { reason: dto.reason })));
        });
    }
};
exports.TamaraService = TamaraService;
exports.TamaraService = TamaraService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object])
], TamaraService);
