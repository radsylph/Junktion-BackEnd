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
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsRequest,
    getFriendsPublications,
    getPublication,
    getFriends,
    deleteFriend,
    getMyFriends,

} from "../controllers/publications.controllers";
import passport from "passport";

const router = express.Router();

router.get("/get", passport.authenticate("jwt", { session: false }), getPublications);
router.get("/get/:publicationId", passport.authenticate("jwt", { session: false }), getPublication);
router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    createPublication
);
router.delete("/delete/:publicationId", passport.authenticate("jwt", { session: false }), deletePublication);
router.patch("/like/:publicationId", passport.authenticate("jwt", { session: false }), likePublication)
router.put("/edit/:publicationId", passport.authenticate("jwt", { session: false }), editPublication)
router.get("/getAll/:userId", passport.authenticate("jwt", { session: false }), getUserPublications)
router.get("/like/:publicationId", passport.authenticate("jwt", { session: false }), getLikesPublication)
router.get("/like", passport.authenticate("jwt", { session: false }), getLikes),
    router.patch("/bookmark/:postId", passport.authenticate("jwt", { session: false }), bookMarkPublication)
router.get("/bookmark", passport.authenticate("jwt", { session: false }), getBookMarks)
router.get("/bookmark/:postId", passport.authenticate("jwt", { session: false }), getBookMarksPublication)
router.get("/:userId/bookmark", passport.authenticate("jwt", { session: false }), getMyBookMarks);
router.get("/getFriendRequests", passport.authenticate("jwt", { session: false }), getFriendsRequest);
router.post("/sendFriendRequest/:receiver", passport.authenticate("jwt", { session: false }), sendFriendRequest);
router.post("/acceptFriendRequest/:sender", passport.authenticate("jwt", { session: false }), acceptFriendRequest);
router.post("/rejectFriendRequest/:sender", passport.authenticate("jwt", { session: false }), rejectFriendRequest);
//router.get("/getFriendRequests", passport.authenticate("jwt", { session: false }), getFriendsRequest);
router.get("/getFriendsPublications", passport.authenticate("jwt", { session: false }), getFriendsPublications);
router.get("/getFriends/:userId", passport.authenticate("jwt", { session: false }), getFriends);
router.delete("/deleteFriend/:friendId", passport.authenticate("jwt", { session: false }), deleteFriend);


export default router;
