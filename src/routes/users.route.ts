import express from "express";
import {
    createUser,
    loginUser,
    EditUser,
    deleteUser,
    changePassword,
    getUser,
    getAnotherUser,
    getAllUsers
} from "../controllers/users.controllers";
import passport from "passport";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/getAll", passport.authenticate("jwt", { session: false }), getAllUsers);
router.put("/edit", passport.authenticate("jwt", { session: false }), EditUser);
router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    deleteUser
);
router.get(
    "/getUser",
    passport.authenticate("jwt", { session: false }),
    getUser
);

router.get("/getUser/:userId", getAnotherUser);
router.patch("/changePassword", passport.authenticate("jwt", { session: false }), changePassword);

export default router;
