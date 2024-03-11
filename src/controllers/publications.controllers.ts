import { Request, Response, NextFunction } from "express";
import Publication from "../models/publication";
import Like from "../models/like";
import BookMark from "../models/bookMark";
import Friend from "../models/friend";
import FriendRequest from "../models/friendRequest";
import { decryptToken } from "../utils/jwt";
import User from "../models/user";

const createPublication = async (req: Request, res: Response) => {
    const { title, content, images } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    //const owner = payload.user._id;
    try {
        const publication = await Publication.create({
            owner: payload.user._id,
            title,
            content,
            images,
        });
        publication.save();
        return res.status(200).json({ message: "Publication created", publication });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
const getPublications = async (req: Request, res: Response) => {
    try {
        const publications = await Publication.find().populate("owner").exec();
        return res.status(200).json({ message: "Publications find", publications });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
const getPublication = async (req: Request, res: Response) => {
    try {
        const { publicationId } = req.params
        const publication = await Publication.findById(publicationId).populate("owner").exec();
        return res.status(200).json({ message: "Publications find", publication });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const likePublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    let isLiked = false;
    try {
        const existingPublication = await Publication.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        const existingLike = await Like.findOne({
            userId: payload.user._id,
            publicationId,
        });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            const likedPublication = await Publication.findByIdAndUpdate(publicationId, { $inc: { likes: -1 }, $set: { Isliked: false } });
            isLiked = false;
            return res.status(200).json({ message: "Like removed", code: 200, isLiked });
        } else {
            const createLike = await Like.create({
                userId: payload.user._id,
                publicationId,
            });
            createLike.save();
            await Publication.findByIdAndUpdate(publicationId, { $inc: { likes: +1 }, $set: { isLiked: true } });
            isLiked = true;
            return res.status(201).json({ message: "Like created", code: 201, isLiked });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getLikesPublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    try {
        const likes = await Like.find({ publicationId });
        return res.status(200).json({ message: "Likes find", likes });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getLikes = async (req: Request, res: Response) => {
    try {
        const likes = await Like.find({});
        return res.status(200).json({ message: "Likes find", likes });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const bookMarkPublication = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    let bookMark = false;
    try {
        const existingPublication = await Publication.find({ _id: postId }).populate("owner").exec();
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        const existingBookMark = await BookMark.findOne({
            userId: payload.user._id,
            publicationId: postId,
        });
        if (existingBookMark) {
            await BookMark.findByIdAndDelete(existingBookMark._id);
            bookMark = false;
            return res.status(200).json({ message: "Bookmark removed", code: 200, bookMark });
        } else {
            const bookmarkedPublication = await BookMark.create({
                userId: payload.user._id,
                publicationId: postId,
            });
            (await bookmarkedPublication.save()).populate("publicationId", "userId");
            bookMark = true;
            return res.status(201).json({ message: "Bookmark created", code: 201, bookMark });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getBookMarks = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const bookmarks = await BookMark.find().exec();
        return res.status(200).json({ message: "Bookmarks find", bookmarks });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getMyBookMarks = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const bookmarks = await BookMark.find({ userId })
            .populate({ path: "publicationId", populate: { path: "owner" } })
            .exec();
        const bookmarkPublication = bookmarks.map((bookmark) => bookmark.publicationId);
        if (!bookmarks) {
            return res.status(404).json({ message: "Bookmarks not found" });
        }
        return res.status(200).json({ message: "Bookmark publications found", bookmarkPublication });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });

    }
}
const getBookMarksPublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    try {
        const bookmarks = await BookMark.find({ publicationId }).populate("userId").exec();
        return res.status(200).json({ message: "Bookmarks find", bookmarks });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }

}
const editPublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const { title, content, images } = req.body;
    try {
        const existingPublication = await Publication.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" })
        }
        const editedPublication = await Publication.findByIdAndUpdate(publicationId, {
            title,
            content,
            images,
            isEdited: true,
        });
        return res.status(200).json({ message: "Publication edited", editedPublication });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }

}
const deletePublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const existingPublication = await Publication.findById(publicationId);
        if (!existingPublication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        if (existingPublication.owner !== payload.user._id) {
            return res.status(401).json({ message: "You are not the owner of this publication" })
        }
        await Like.deleteMany({ publicationId });
        await BookMark.deleteMany({ publicationId });
        await Publication.findByIdAndDelete(publicationId);
        return res.status(200).json({ message: "Publication deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getUserPublications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const existingPublications = await Publication.find({ owner: userId }).populate("owner").exec();
        if (!existingPublications) {
            return res.status(404).json({ message: "this user doesn't have publications yet" });
        }
        return res.status(200).json({ message: "Publications find", existingPublications });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }

}
const sendFriendRequest = async (req: Request, res: Response) => {
    const { receiver } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const sender = payload.user._id;
    try {
        const existingFriendRequest = await FriendRequest.findOne({ sender, receiver });
        if (existingFriendRequest) {
            const friendRequestRemove = await FriendRequest.findByIdAndDelete(existingFriendRequest._id);
            return res.status(200).json({ message: "Friend request removed", friendRequestRemove });
        }
        const friendRequest = await FriendRequest.create({ sender, receiver, status: "pending" });
        friendRequest.save();
        return res.status(201).json({ message: "Friend request sent", friendRequest });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const acceptFriendRequest = async (req: Request, res: Response) => {
    const { sender } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const receiver = payload.user._id;
    try {
        const existingFriendRequest = await FriendRequest.findOne({ sender, receiver });
        if (!existingFriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        const friend = await Friend.create({ mySelf: receiver, myFriend: sender });
        friend.save();
        const friendRequest = await FriendRequest.findByIdAndDelete(existingFriendRequest._id);
        const updateFriends1 = await User.findByIdAndUpdate(sender, { $inc: { myFriends: +1 } });
        const updateFriends2 = await User.findByIdAndUpdate(receiver, { $inc: { myFriends: +1 } });
        updateFriends1.save();
        updateFriends2.save();
        return res.status(200).json({ message: "Friend request accepted", friendRequest });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const rejectFriendRequest = async (req: Request, res: Response) => {
    const { sender } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const receiver = payload.user._id;
    try {
        const existingFriendRequest = await FriendRequest.findOne({ sender, receiver });
        if (!existingFriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        const friendRequest = await FriendRequest.findByIdAndDelete(existingFriendRequest._id);
        return res.status(200).json({ message: "Friend request rejected", friendRequest });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const deleteFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    try {
        const existingFriend = await Friend.findByIdAndDelete(friendId);
        if (!existingFriend) {
            return res.status(404).json({ message: "Friend not found" });
        }
        return res.status(200).json({ message: "Friend deleted", existingFriend });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getMyFriends = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const mySelf = payload.user._id;
    try {
        const friends = await Friend.find({ mySelf }).populate("myFriend").exec();
        return res.status(200).json({ message: "Friends find", friends });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getFriendsRequest = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const mySelf = payload.user._id;
    try {
        const friendsRequest = await FriendRequest.find({ receiver: mySelf }).populate("sender").exec();
        return res.status(200).json({ message: "Friends request find", friendsRequest });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getFriendsPublications = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const mySelf = payload.user._id;
    try {
        const friends = await Friend.find({
            mySelf,
        }).exec();
        const friendsIds = await User.find({ _id: { $in: friends.map((friend) => friend.myFriend) } });
        const friendsPublications = await Publication.find({ owner: { $in: friendsIds.map((friend) => friend._id) } }).populate("owner").exec();
        return res.status(200).json({ message: "Friends publications find", friendsPublications });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const getFriends = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const userFriends = await Friend.find({ mySelf: userId }).populate("myFriend").exec();
        return res.status(200).json({ message: "Friends find", userFriends });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }

}


export { createPublication, getPublications, likePublication, editPublication, deletePublication, getUserPublications, getLikes, getLikesPublication, bookMarkPublication, getBookMarks, getBookMarksPublication, getMyBookMarks, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriend, getFriendsRequest, getMyFriends, getFriendsPublications, getPublication, getFriends }