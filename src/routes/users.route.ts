import express from "express";
import {
    createUser,
    loginUser,
    test,
    EditUser,
    deleteUser,
    test2,
    getUser,
} from "../controllers/users.controllers";
import passport from "passport";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/test", passport.authenticate("jwt", { session: false }), test);
router.put("/edit", passport.authenticate("jwt", { session: false }), EditUser);
router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    deleteUser
);
router.get("/test2", test2);
router.get(
    "/getUser",
    passport.authenticate("jwt", { session: false }),
    getUser
);
export default router;
