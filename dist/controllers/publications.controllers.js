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
exports.deleteComment = exports.editComment = exports.getComments = exports.makeComment = exports.getFriends = exports.getPublication = exports.getFriendsPublications = exports.getMyFriends = exports.getFriendsRequest = exports.deleteFriend = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getMyBookMarks = exports.getBookMarksPublication = exports.getBookMarks = exports.bookMarkPublication = exports.getLikesPublication = exports.getLikes = exports.getUserPublications = exports.deletePublication = exports.editPublication = exports.likePublication = exports.getPublications = exports.createPublication = void 0;
const publication_1 = __importDefault(require("../models/publication"));
const like_1 = __importDefault(require("../models/like"));
const bookMark_1 = __importDefault(require("../models/bookMark"));
const friend_1 = __importDefault(require("../models/friend"));
const friendRequest_1 = __importDefault(require("../models/friendRequest"));
const jwt_1 = require("../utils/jwt");
const user_1 = __importDefault(require("../models/user"));
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
        const publications = yield publication_1.default.find({ isComment: false }).populate("owner").exec();
        return res.status(200).json({ message: "Publications find", publications });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getPublications = getPublications;
const getPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicationId } = req.params;
        const publication = yield publication_1.default.findById(publicationId).populate("owner").exec();
        return res.status(200).json({ message: "Publications find", publication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getPublication = getPublication;
const likePublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { publicationId } = req.params;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    let isLiked = false;
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        const existingLike = yield like_1.default.findOne({
            userId: payload.user._id,
            publicationId,
        });
        if (existingLike) {
            yield like_1.default.findByIdAndDelete(existingLike._id);
            const likedPublication = yield publication_1.default.findByIdAndUpdate(publicationId, { $inc: { likes: -1 }, $set: { Isliked: false } });
            isLiked = false;
            return res.status(200).json({ message: "Like removed", code: 200, isLiked });
        }
        else {
            const createLike = yield like_1.default.create({
                userId: payload.user._id,
                publicationId,
            });
            createLike.save();
            yield publication_1.default.findByIdAndUpdate(publicationId, { $inc: { likes: +1 }, $set: { isLiked: true } });
            isLiked = true;
            return res.status(201).json({ message: "Like created", code: 201, isLiked });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.likePublication = likePublication;
const getLikesPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicationId } = req.params;
    try {
        const likes = yield like_1.default.find({ publicationId });
        return res.status(200).json({ message: "Likes find", likes });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getLikesPublication = getLikesPublication;
const getLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const likes = yield like_1.default.find({});
        return res.status(200).json({ message: "Likes find", likes });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getLikes = getLikes;
const bookMarkPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { postId } = req.params;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    let bookMark = false;
    try {
        const existingPublication = yield publication_1.default.find({ _id: postId }).populate("owner").exec();
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        const existingBookMark = yield bookMark_1.default.findOne({
            userId: payload.user._id,
            publicationId: postId,
        });
        if (existingBookMark) {
            yield bookMark_1.default.findByIdAndDelete(existingBookMark._id);
            bookMark = false;
            return res.status(200).json({ message: "Bookmark removed", code: 200, bookMark });
        }
        else {
            const bookmarkedPublication = yield bookMark_1.default.create({
                userId: payload.user._id,
                publicationId: postId,
            });
            (yield bookmarkedPublication.save()).populate("publicationId", "userId");
            bookMark = true;
            return res.status(201).json({ message: "Bookmark created", code: 201, bookMark });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.bookMarkPublication = bookMarkPublication;
const getBookMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const bookmarks = yield bookMark_1.default.find().exec();
        return res.status(200).json({ message: "Bookmarks find", bookmarks });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getBookMarks = getBookMarks;
const getMyBookMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { userId } = req.params;
    const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const bookmarks = yield bookMark_1.default.find({ userId })
            .populate({ path: "publicationId", populate: { path: "owner" } })
            .exec();
        const bookmarkPublication = bookmarks.map((bookmark) => bookmark.publicationId);
        if (!bookmarks) {
            return res.status(404).json({ message: "Bookmarks not found" });
        }
        return res.status(200).json({ message: "Bookmark publications found", bookmarkPublication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getMyBookMarks = getMyBookMarks;
const getBookMarksPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicationId } = req.params;
    try {
        const bookmarks = yield bookMark_1.default.find({ publicationId }).populate("userId").exec();
        return res.status(200).json({ message: "Bookmarks find", bookmarks });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getBookMarksPublication = getBookMarksPublication;
const editPublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { publicationId } = req.params;
    const token = (_f = req.headers.authorization) === null || _f === void 0 ? void 0 : _f.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const { title, content, images } = req.body;
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        const editedPublication = yield publication_1.default.findByIdAndUpdate(publicationId, {
            title,
            content,
            images,
            isEdited: true,
        });
        return res.status(200).json({ message: "Publication edited", editedPublication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.editPublication = editPublication;
const deletePublication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { publicationId } = req.params;
    const token = (_g = req.headers.authorization) === null || _g === void 0 ? void 0 : _g.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        const comments = yield publication_1.default.find({ commentTo: publicationId });
        if (comments) {
            comments.forEach((comment) => __awaiter(void 0, void 0, void 0, function* () {
                yield like_1.default.deleteMany({ commentId: comment._id });
                yield bookMark_1.default.deleteMany({ commentId: comment._id });
                yield publication_1.default.findByIdAndDelete(comment._id);
            }));
        }
        yield like_1.default.deleteMany({ publicationId });
        yield bookMark_1.default.deleteMany({ publicationId });
        yield publication_1.default.findByIdAndDelete(publicationId);
        return res.status(200).json({ message: "Publication deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deletePublication = deletePublication;
const getUserPublications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const { userId } = req.params;
    const token = (_h = req.headers.authorization) === null || _h === void 0 ? void 0 : _h.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingPublications = yield publication_1.default.find({ owner: userId }).populate("owner").exec();
        if (!existingPublications) {
            return res.status(404).json({ message: "this user doesn't have publications yet" });
        }
        return res.status(200).json({ message: "Publications find", existingPublications });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getUserPublications = getUserPublications;
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const { receiver } = req.params;
    const token = (_j = req.headers.authorization) === null || _j === void 0 ? void 0 : _j.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const sender = payload.user._id;
    try {
        const existingFriendRequest = yield friendRequest_1.default.findOne({ sender, receiver });
        if (existingFriendRequest) {
            const friendRequestRemove = yield friendRequest_1.default.findByIdAndDelete(existingFriendRequest._id);
            return res.status(200).json({ message: "Friend request removed", friendRequestRemove });
        }
        const friendRequest = yield friendRequest_1.default.create({ sender, receiver, status: "pending" });
        friendRequest.save();
        return res.status(201).json({ message: "Friend request sent", friendRequest });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.sendFriendRequest = sendFriendRequest;
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const { sender } = req.params;
    const token = (_k = req.headers.authorization) === null || _k === void 0 ? void 0 : _k.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const receiver = payload.user._id;
    try {
        const existingFriendRequest = yield friendRequest_1.default.findOne({ sender, receiver });
        if (!existingFriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        const friend = (yield friend_1.default.create({ mySelf: receiver, myFriend: sender })).save();
        const friend2 = (yield friend_1.default.create({ mySelf: sender, myFriend: receiver })).save();
        const friendRequest = yield friendRequest_1.default.findByIdAndDelete(existingFriendRequest._id);
        const updateFriends1 = (yield user_1.default.findByIdAndUpdate(sender, { $inc: { myFriends: +1 } })).save();
        const updateFriends2 = (yield user_1.default.findByIdAndUpdate(receiver, { $inc: { myFriends: +1 } })).save();
        return res.status(200).json({ message: "Friend request accepted", friendRequest });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
const rejectFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const { sender } = req.params;
    const token = (_l = req.headers.authorization) === null || _l === void 0 ? void 0 : _l.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const receiver = payload.user._id;
    try {
        const existingFriendRequest = yield friendRequest_1.default.findOne({ sender, receiver });
        if (!existingFriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        const friendRequest = yield friendRequest_1.default.findByIdAndDelete(existingFriendRequest._id);
        return res.status(200).json({ message: "Friend request rejected", friendRequest });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.rejectFriendRequest = rejectFriendRequest;
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    const { myFriend } = req.params;
    const token = (_m = req.headers.authorization) === null || _m === void 0 ? void 0 : _m.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const mySelf = payload.user._id;
    try {
        const existingFriend1 = yield friend_1.default.findOne({ mySelf, myFriend });
        const existingFriend2 = yield friend_1.default.findOne({ mySelf: myFriend, myFriend: mySelf });
        if (!existingFriend1 || !existingFriend2) {
            return res.status(404).json({ message: "Friend not found" });
        }
        const updateFriends1 = yield user_1.default.findByIdAndUpdate(mySelf, { $inc: { myFriends: -1 } });
        const updateFriends2 = yield user_1.default.findByIdAndUpdate(myFriend, { $inc: { myFriends: -1 } });
        if (!updateFriends1 || !updateFriends2) {
            return res.status(404).json({ message: "User not found" });
        }
        const deletedFriendship1 = yield friend_1.default.findByIdAndDelete(existingFriend1._id);
        const deletedFriendship2 = yield friend_1.default.findByIdAndDelete(existingFriend2._id);
        return res.status(200).json({ message: "FriendShip deleted", });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteFriend = deleteFriend;
const getMyFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    const token = (_o = req.headers.authorization) === null || _o === void 0 ? void 0 : _o.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const mySelf = payload.user._id;
    try {
        const friends = yield friend_1.default.find({ mySelf }).populate("myFriend").exec();
        return res.status(200).json({ message: "Friends find", friends });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getMyFriends = getMyFriends;
const getFriendsRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    const token = (_p = req.headers.authorization) === null || _p === void 0 ? void 0 : _p.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const mySelf = payload.user._id;
    try {
        const friendsRequest = yield friendRequest_1.default.find({ receiver: mySelf }).populate("sender").exec();
        return res.status(200).json({ message: "Friends request find", friendsRequest });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getFriendsRequest = getFriendsRequest;
const getFriendsPublications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    const token = (_q = req.headers.authorization) === null || _q === void 0 ? void 0 : _q.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const mySelf = payload.user._id;
    try {
        const friends = yield friend_1.default.find({
            mySelf,
        }).exec();
        const friendsIds = yield user_1.default.find({ _id: { $in: friends.map((friend) => friend.myFriend) } });
        const friendsPublications = yield publication_1.default.find({ owner: { $in: friendsIds.map((friend) => friend._id) } }).populate("owner").exec();
        return res.status(200).json({ message: "Friends publications find", friendsPublications });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getFriendsPublications = getFriendsPublications;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userFriends = yield friend_1.default.find({ mySelf: userId }).populate("myFriend").exec();
        return res.status(200).json({ message: "Friends find", userFriends });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getFriends = getFriends;
const makeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    const { publicationId } = req.params;
    const token = (_r = req.headers.authorization) === null || _r === void 0 ? void 0 : _r.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const { title, content, images } = req.body;
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        const newComment = yield publication_1.default.create({
            title,
            content,
            owner: payload.user._id,
            images: images ? images : [],
            isComment: true,
            commentTo: publicationId,
        });
        newComment.save();
        const publication = yield publication_1.default.findByIdAndUpdate(publicationId, { $inc: { comments: +1 } });
        return res.status(201).json({ message: "Comment created", newComment });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.makeComment = makeComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicationId } = req.params;
    try {
        const comments = yield publication_1.default.find({ commentTo: publicationId }).populate("owner").exec();
        return res.status(200).json({ message: "Comments find", comments });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getComments = getComments;
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    const { publicationId } = req.params;
    const token = (_s = req.headers.authorization) === null || _s === void 0 ? void 0 : _s.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    const { title, content, images } = req.body;
    try {
        const existingPublication = yield publication_1.default.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        const editedPublication = yield publication_1.default.findByIdAndUpdate(publicationId, {
            title,
            content,
            images,
            isEdited: true,
        });
        return res.status(200).json({ message: "Publication edited", editedPublication });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.editComment = editComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t;
    const { commentId } = req.params;
    const token = (_t = req.headers.authorization) === null || _t === void 0 ? void 0 : _t.split(" ")[1];
    const payload = (0, jwt_1.decryptToken)(token);
    try {
        const existingPublication = yield publication_1.default.findById(commentId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" });
        }
        if (existingPublication.isComment === false) {
            return res.status(401).json({ message: "This publication is not a comment" });
        }
        const originalPublication = yield publication_1.default.findById(existingPublication.commentTo);
        if (!originalPublication) {
            return res.status(404).json({ message: "Original publication not found" });
        }
        originalPublication.comments--;
        yield originalPublication.save();
        yield publication_1.default.findByIdAndDelete(commentId);
        yield like_1.default.deleteMany({ commentId });
        yield bookMark_1.default.deleteMany({
            commentId,
        });
        return res.status(200).json({ message: "Publication deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteComment = deleteComment;
