"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const friendRequestSchema = new mongoose_1.default.Schema({
    sender: { type: String, required: true, unique: false, ref: "User" },
    receiver: { type: String, required: true, unique: false, ref: "User" },
    status: { type: String, required: true, unique: false, enum: ["pending", "accepted", "rejected"] }
});
const FriendRequest = mongoose_1.default.model("FriendRequest", friendRequestSchema);
exports.default = FriendRequest;
