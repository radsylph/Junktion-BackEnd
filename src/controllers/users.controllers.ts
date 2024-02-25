import { Request, Response, NextFunction } from "express";
import passport from "../configs/passport";
import User from "../models/user";
import AuthRequest from "../interfaces/authRequest.interface";
import { generateToken, decryptToken } from "../utils/jwt";

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
        await User.findByIdAndDelete(payload.user._id).exec();
        return res.json({ message: "User deleted", user });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
};

const EditUser = async (req: AuthRequest, res: Response) => {
    const { email, username, password } = req.body;
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
        await currentUser.save();
        return res.json({ message: "User edited", currentUser });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error });
    }
};

const test = async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const userId: any = decryptToken(token);
        const userFound = await User.findById(userId.user._id).exec();

        return res.json({
            message: "testing",
            token: token,
            user: userFound,
            userId,
        });
    } catch (error) {
        return res.status(404).json({ message: "User not found", error: error });
    }
};

const test2 = (req: Request, res: Response) => {
    return res.json({ message: "testing" });
};

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
export { createUser, loginUser, test, test2, EditUser, deleteUser, getUser };
