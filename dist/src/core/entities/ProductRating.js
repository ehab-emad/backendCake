"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRating = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
class ProductRating extends AggregateRoot_1.AggregateRoot {
    constructor(id, productId, name, comment = '', rating, images = [], createdAt, updatedAt) {
        super();
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.ProductRating = ProductRating;
