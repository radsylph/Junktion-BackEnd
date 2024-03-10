import express from "express";
import {
    createPublication,
    getPublications,
    likePublication,
    editPublication,
    getUserPublications,
    getLikes,
    getLikesPublication,
    bookMarkPublication,
    getBookMarks,
    getBookMarksPublication,
    getMyBookMarks,
    deletePublication,

} from "../controllers/publications.controllers";
import passport from "passport";

const router = express.Router();

router.get("/get", passport.authenticate("jwt", { session: false }), getPublications);
router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    createPublication
);
router.delete("/delete/:publicationId", passport.authenticate("jwt", { session: false }), deletePublication);
router.patch("/like/:publicationId", passport.authenticate("jwt", { session: false }), likePublication)
router.put("/edit/:publicationId", passport.authenticate("jwt", { session: false }), editPublication)
router.get("/get/:userId", passport.authenticate("jwt", { session: false }), getUserPublications)
router.get("/like/:publicationId", passport.authenticate("jwt", { session: false }), getLikesPublication)
router.get("/like", passport.authenticate("jwt", { session: false }), getLikes),
    router.patch("/bookmark/:postId", passport.authenticate("jwt", { session: false }), bookMarkPublication)
router.get("/bookmark", passport.authenticate("jwt", { session: false }), getBookMarks)
router.get("/bookmark/:postId", passport.authenticate("jwt", { session: false }), getBookMarksPublication)
router.get("/:userId/bookmark", passport.authenticate("jwt", { session: false }), getMyBookMarks);

export default router;
