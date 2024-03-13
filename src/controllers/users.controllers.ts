import { Request, Response, NextFunction } from "express";
import passport from "../configs/passport";
import User from "../models/user";
import Friend from "../models/friend";
import FriendRequest from "../models/friendRequest";
import Publication from "../models/publication";
import Like from "../models/like";
import AuthRequest from "../interfaces/authRequest.interface";
import { generateToken, decryptToken } from "../utils/jwt";
import BookMark from "../models/bookMark";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    await passport.authenticate("signup", (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({ message: "errors", error: err });
        }
        if (!user) {
            return res.status(400).json(info);
        }
        return res.json({ message: "User created", user });
    })(req, res, next);
};

const loginUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    await passport.authenticate("login", (err: any, user: any, info: any) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Internal server error", error: err });
        }
        if (!user) {
            return res.status(400).json(info);
        }
        try {
            req.login(user, { session: false }, async (error) => {
                if (error) {
                    return next(error);
                }
                const body = { _id: user._id };
                const token = generateToken(body);
                req.token = token;
                return res.json({ user: user, token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

const deleteUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const user = await User.findById(payload.user._id).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userLikes = await Like.find({ userId: user._id }).exec();
        await Promise.all(userLikes.map(async (like) => {
            await Publication.findByIdAndUpdate(like.publicationId, {
                $inc: { likes: -1 },
            }).exec();
            await Like.findByIdAndDelete(like._id).exec();
        }));
        const userFriends = await Friend.find({ mySelf: user._id }).exec();
        await Promise.all(userFriends.map(async (friend) => {
            await User.findByIdAndUpdate(friend.myFriend, {
                $inc: { friends: -1 },
            }).exec();
            const friends1 = await Friend.find({ mySelf: user._id, myFriend: friend.myFriend }).exec();
            await Promise.all(friends1.map((friend) => Friend.findByIdAndDelete(friend._id).exec()));
            const friends2 = await Friend.find({ mySelf: friend.myFriend, myFriend: user._id }).exec();
            await Promise.all(friends2.map((friend) => Friend.findByIdAndDelete(friend._id).exec()));
        }));
        const userPublications = await Publication.find({ owner: user._id }).exec();
        await Promise.all(userPublications.map(async (publication) => {
            await Like.deleteMany({ publication: publication._id }).exec();
            await BookMark.deleteMany({ publication: publication._id }).exec();
            await Publication.findByIdAndDelete(publication._id).exec();
        }));
        await User.findByIdAndDelete(payload.user._id).exec();
        return res.json({ message: "User deleted", user });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
};

const EditUser = async (req: AuthRequest, res: Response) => {
    const { email, username, password, name, lastname, profilePicture } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const currentUser: any = await User.findById(payload.user._id).exec();
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (currentUser._id != payload.user._id) {
            return res.status(401).json({
                message: "You can't edit this user",
                CurrentUser: currentUser._id,
                payload: payload.user._id,
            });
        }
        if (currentUser.email != email) {
            try {
                const existingEmail = await User.findOne({ email: email }).exec();
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: "Internal server error", error: error });
            }
        }
        currentUser.email = email;
        currentUser.username = username;
        currentUser.password = password;
        currentUser.name = name;
        currentUser.lastname = lastname;
        currentUser.profilePicture = profilePicture;
        await currentUser.save();
        return res.json({ message: "User edited", currentUser });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
};

const changePassword = async (req: AuthRequest, res: Response) => {
    const { newPassword } = req.body;
    console.log(req.body)
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const currentUser: any = await User.findById(payload.user._id).exec();
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (currentUser._id != payload.user._id) {
            return res.status(401).json({
                message: "You can't edit this user",
                CurrentUser: currentUser._id,
                payload: payload.user._id,
            });
        }
        currentUser.password = newPassword;
        await currentUser.save();
        return res.json({ message: "Password changed", currentUser });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
}

const getUser = async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const id = payload.user._id;
    try {
        const user = await User.findById(payload.user._id).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User found", user });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
};

const getAnotherUser = async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const id = payload.user._id;
    const { userId } = req.params;
    try {
        let statusUser: string = '';
        const user: any = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const status = await Friend.findOne({ mySelf: id, myFriend: userId }).exec();
        if (status) {
            statusUser = "friend";
        } else {
            const request = await FriendRequest.findOne({ sender: id, receiver: userId }).exec();
            if (request) {
                statusUser = "requestSent";
            } else {
                const request2 = await FriendRequest.findOne({ sender: userId, receiver: id }).exec();
                if (request2) {
                    statusUser = "requestReceived";
                } else {
                    statusUser = "noFriend";
                }
            }
        }

        return res.json({ message: "User found", user, status: statusUser });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
}
const getAllUsers = async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    const id = payload.user._id;
    try {
        const users = await User.find().exec();
        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }
        return res.json({ message: "Users found", users });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
}
export { createUser, loginUser, EditUser, deleteUser, getUser, changePassword, getAnotherUser, getAllUsers };
