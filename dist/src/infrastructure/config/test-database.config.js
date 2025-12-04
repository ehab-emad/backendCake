"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
exports.TestDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [
        path_1.default.resolve(__dirname, "../../core/entities/*.{js,ts}"),
    ],
    synchronize: true,
    logging: false,
});
