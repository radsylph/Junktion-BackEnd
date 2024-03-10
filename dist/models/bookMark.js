"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookMarkSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: false, ref: "User" },
    publicationId: { type: String, required: true, unique: false, ref: "Publication" }
});
const BookMark = mongoose_1.default.model("BookMark", BookMarkSchema);
exports.default = BookMark;
