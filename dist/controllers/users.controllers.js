"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.deleteUser = exports.EditUser = exports.test2 = exports.test = exports.loginUser = exports.createUser = void 0;
const passport_1 = __importDefault(require("../configs/passport"));
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = require("../utils/jwt");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield passport_1.default.authenticate("signup", (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "errors", error: err });
        }
        if (!user) {
            return res.status(400).json(info);
        }
        return res.json({ message: "User created", user });
    })(req, res, next);
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield passport_1.default.authenticate("login", (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Internal server error", error: err });
        }
        if (!user) {
            return res.status(400).json(info);
        }
        try {
            req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    return next(error);
                }
                const body = { _id: user._id };
                const token = (0, jwt_1.generateToken)(body);
                req.token = token;
                return res.json({ user: user, token });
            }));
        }
        catch (error) {
            return next(error);
        }
    })(req, res, next);
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const user = yield user_1.default.findById(payload.user._id).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield user_1.default.findByIdAndDelete(payload.user._id).exec();
        return res.json({ message: "User deleted", user });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
});
exports.deleteUser = deleteUser;
const EditUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { email, username, password } = req.body;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const currentUser = yield user_1.default.findById(payload.user._id).exec();
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (currentUser._id != payload.user._id) {
            return res.status(401).json({
                message: "You can't edit this user",
                CurrentUser: currentUser._id,
                payload: payload.user._id,
            });
        }
        if (currentUser.email != email) {
            try {
                const existingEmail = yield user_1.default.findOne({ email: email }).exec();
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Internal server error", error: error });
            }
        }
        currentUser.email = email;
        currentUser.username = username;
        currentUser.password = password;
        yield currentUser.save();
        return res.json({ message: "User edited", currentUser });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
});
exports.EditUser = EditUser;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
    try {
        const userId = (0, jwt_1.decryptToken)(token);
        const userFound = yield user_1.default.findById(userId.user._id).exec();
        return res.json({
            message: "testing",
            token: token,
            user: userFound,
            userId,
        });
    }
    catch (error) {
        return res.status(404).json({ message: "User not found", error: error });
    }
});
exports.test = test;
const test2 = (req, res) => {
    return res.json({ message: "testing" });
};
exports.test2 = test2;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const id = payload.user._id;
    try {
        const user = yield user_1.default.findById(payload.user._id).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User found", user });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
});
exports.getUser = getUser;
