"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const ProductImageAdded_1 = require("../events/ProductImageAdded");
const ProductImageRemoved_1 = require("../events/ProductImageRemoved");
const AggregateRoot_1 = require("./AggregateRoot");
class ProductImage extends AggregateRoot_1.AggregateRoot {
    constructor(id, productId, path) {
        super();
        this.id = id;
        this.productId = productId;
        this.path = path;
    }
    markAdded() {
        this.apply(new ProductImageAdded_1.ProductImageAdded(this.productId, this.id));
    }
    markRemoved() {
        this.apply(new ProductImageRemoved_1.ProductImageRemoved(this.productId, this.id));
    }
}
exports.ProductImage = ProductImage;
