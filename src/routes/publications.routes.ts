import express from "express";
import {
    createPublication,
    getPublications,
    likePublication,
    editPublication,
    getUserPublications,
    getLikes,
    getLikesPublication
} from "../controllers/publications.controllers";
import passport from "passport";

const router = express.Router();

router.get("/get", passport.authenticate("jwt", { session: false }), getPublications);
router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    createPublication
);
router.patch("/like/:publicationId", passport.authenticate("jwt", { session: false }), likePublication)
router.put("/edit/:publicationId", passport.authenticate("jwt", { session: false }), editPublication)
router.get("/get/:userId", passport.authenticate("jwt", { session: false }), getUserPublications)
router.get("/like/:publicationId", passport.authenticate("jwt", { session: false }), getLikesPublication)
router.get("/like", passport.authenticate("jwt", { session: false }), getLikes)

export default router;
