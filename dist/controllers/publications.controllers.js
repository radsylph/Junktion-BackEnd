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
exports.getPublications = exports.createPublication = void 0;
const publication_1 = __importDefault(require("../models/publication"));
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
    }
    catch (error) {
    }
});
