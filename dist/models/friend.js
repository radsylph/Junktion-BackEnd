"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const friendSchema = new mongoose_1.default.Schema({
    mySelf: { type: String, required: true, unique: false, ref: "User" },
    myFriend: { type: String, required: true, unique: false, ref: "User" }
});
const Friend = mongoose_1.default.model("Friend", friendSchema);
exports.default = Friend;
