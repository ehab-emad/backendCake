"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageRemoved = void 0;
class ProductImageRemoved {
    constructor(productId, imageId) {
        this.productId = productId;
        this.imageId = imageId;
        this.occurredOn = new Date();
    }
}
exports.ProductImageRemoved = ProductImageRemoved;
