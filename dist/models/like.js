"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const likeSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: false, ref: "User" },
    publicationId: { type: String, required: true, unique: false, ref: "Publication" }
});
const Like = mongoose_1.default.model("Like", likeSchema);
exports.default = Like;
