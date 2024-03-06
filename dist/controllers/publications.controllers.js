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
exports.getUserPublications = exports.deletePublication = exports.editPublication = exports.likePublication = exports.getPublications = exports.createPublication = void 0;
const publication_1 = __importDefault(require("../models/publication"));
const like_1 = __importDefault(require("../models/like"));
const jwt_1 = require("../utils/jwt");
const createPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content, images } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    //const owner = payload.user._id;
    try {
        const publication = yield publication_1.default.create({
            owner: payload.user._id,
            title,
            content,
            images,
        });
        publication.save();
        return res.status(200).json({ message: "Publication created", publication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createPublication = createPublication;
const getPublications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publications = yield publication_1.default.find().populate("owner").exec();
        return res.status(200).json({ message: "Publications find", publications });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getPublications = getPublications;
const likePublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { publicationId } = req.params;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingLike = yield like_1.default.findOne({
            userId: payload.user._id,
            publicationId,
        });
        if (existingLike) {
            yield like_1.default.findByIdAndDelete(existingLike._id);
            yield publication_1.default.findByIdAndUpdate(publicationId, { $inc: { likes: -1 } });
            return res.status(200).json({ message: "Like removed" });
        }
        else {
            const createLike = yield like_1.default.create({
                userId: payload.user._id,
                publicationId,
            });
            createLike.save();
            yield publication_1.default.findByIdAndUpdate(publicationId, { $inc: { likes: +1 } });
            return res.status(200).json({ message: "Like created" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.likePublication = likePublication;
const editPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { publicationId } = req.params;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const { title, content, images } = req.body;
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        const editedPublication = yield publication_1.default.findByIdAndUpdate(publicationId, {
            title,
            content,
            images,
            isEdited: true,
        });
        return res.status(200).json({ message: "Publication edited", editedPublication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.editPublication = editPublication;
const deletePublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { publicationId } = req.params;
    const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        yield like_1.default.deleteMany({ publicationId });
        yield publication_1.default.findByIdAndDelete(publicationId);
        return res.status(200).json({ message: "Publication deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deletePublication = deletePublication;
const getUserPublications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { userId } = req.params;
    const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingPublications = yield publication_1.default.find({ owner: userId }).populate("owner").exec();
        if (!existingPublications) {
            return res.status(404).json({ message: "this user doesn't have publications yet" });
        }
        return res.status(200).json({ message: "Publications find", existingPublications });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getUserPublications = getUserPublications;
