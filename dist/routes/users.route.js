"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users.controllers");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/create", users_controllers_1.createUser);
router.post("/login", users_controllers_1.loginUser);
router.get("/getAll", passport_1.default.authenticate("jwt", { session: false }), users_controllers_1.getAllUsers);
router.put("/edit", passport_1.default.authenticate("jwt", { session: false }), users_controllers_1.EditUser);
router.delete("/delete", passport_1.default.authenticate("jwt", { session: false }), users_controllers_1.deleteUser);
router.get("/getUser", passport_1.default.authenticate("jwt", { session: false }), users_controllers_1.getUser);
router.get("/getUser/:userId", users_controllers_1.getAnotherUser);
router.patch("/changePassword", passport_1.default.authenticate("jwt", { session: false }), users_controllers_1.changePassword);
exports.default = router;
