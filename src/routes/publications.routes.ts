import express from "express";
import {
    createPublication,
    getPublications,
} from "../controllers/publications.controllers";
import passport from "passport";

const router = express.Router();

router.get("/getPublications", passport.authenticate("jwt", { session: false }), getPublications);
router.post(
    "/createPublication",
    passport.authenticate("jwt", { session: false }),
    createPublication
);

export default router;
