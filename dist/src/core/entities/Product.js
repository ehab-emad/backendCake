"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
const ProductImage_1 = require("./ProductImage");
class Product extends AggregateRoot_1.AggregateRoot {
    constructor(id, name, clientId, description, fullDescription, price, stockQuantity = 0, imageUrl, material, beads, length, weight, rating = 0, sales = 0, status = 'نشط', createdAt, updatedAt) {
        super();
        this.id = id;
        this.name = name;
        this.clientId = clientId;
        this.description = description;
        this.fullDescription = fullDescription;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.material = material;
        this.beads = beads;
        this.length = length;
        this.weight = weight;
        this.rating = rating;
        this.sales = sales;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.images = [];
        this.ratings = [];
    }
    addImage(img) {
        this.images.push(img);
        this.applyEventsFrom(img);
    }
    removeImage(imageId) {
        this.images = this.images.filter((i) => i.id !== imageId);
        const marker = new ProductImage_1.ProductImage(imageId, this.id, "");
        this.applyEventsFrom(marker);
    }
    addRating(rtg) {
        this.ratings.push(rtg);
        this.applyEventsFrom(rtg);
    }
    applyEventsFrom(ar) {
        for (const e of ar.pullEvents()) {
            this.apply(e);
        }
    }
}
exports.Product = Product;
