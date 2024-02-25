"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const generateToken = (user) => {
    console.log(user);
    return jsonwebtoken_1.default.sign({ user }, process.env.SECRET, {
        expiresIn: process.env.TIME,
    });
};
exports.generateToken = generateToken;
const decryptToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.SECRET);
};
exports.decryptToken = decryptToken;
