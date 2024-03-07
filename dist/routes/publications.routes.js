"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publications_controllers_1 = require("../controllers/publications.controllers");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/get", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.getPublications);
router.post("/create", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.createPublication);
router.patch("/like/:publicationId", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.likePublication);
router.put("/edit/:publicationId", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.editPublication);
router.get("/get/:userId", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.getUserPublications);
router.get("/like/:publicationId", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.getLikesPublication);
router.get("/like", passport_1.default.authenticate("jwt", { session: false }), publications_controllers_1.getLikes);
exports.default = router;
