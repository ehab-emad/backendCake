"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageAdded = void 0;
class ProductImageAdded {
    constructor(productId, imageId) {
        this.productId = productId;
        this.imageId = imageId;
        this.occurredOn = new Date();
    }
}
exports.ProductImageAdded = ProductImageAdded;
