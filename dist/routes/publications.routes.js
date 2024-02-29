"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publications_controllers_1 = require("../controllers/publications.controllers");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/getPublications", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.getPublications);
router.post("/createPublication", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.createPublication);
exports.default = router;
