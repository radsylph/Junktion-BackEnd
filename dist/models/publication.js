"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const publicationSchema = new mongoose_1.default.Schema({
    owner: { type: String, required: true, unique: false, ref: "User" },
    title: { type: String, required: true, unique: false },
    content: { type: String, required: true, unique: false },
    images: { type: [String], required: false, unique: false, default: [] },
    isEdited: { type: Boolean, required: true, unique: false, default: false },
    bookMark: { type: Boolean, required: true, unique: false, default: false },
    likes: { type: Number, required: true, unique: false, default: 0 },
    comments: { type: Number, required: true, unique: false, default: 0 },
}, {
    timestamps: true,
});
const Publication = mongoose_1.default.model("Publication", publicationSchema);
exports.default = Publication;
