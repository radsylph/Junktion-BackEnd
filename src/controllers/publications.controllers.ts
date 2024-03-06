import { Request, Response, NextFunction } from "express";
import Publication from "../models/publication";
import Like from "../models/like";
import { decryptToken } from "../utils/jwt";

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

const likePublication = async (req: Request, res: Response) => {
    const { publicationId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const payload: any = decryptToken(token);
    try {
        const existingLike = await Like.findOne({
            userId: payload.user._id,
            publicationId,
        });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            await Publication.findByIdAndUpdate(publicationId, { $inc: { likes: -1 } });
            return res.status(200).json({ message: "Like removed", code: 200 });

        } else {
            const createLike = await Like.create({
                userId: payload.user._id,
                publicationId,
            });
            createLike.save();
            await Publication.findByIdAndUpdate(publicationId, { $inc: { likes: +1 } });
            return res.status(201).json({ message: "Like created", code: 201 });
        }
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




export { createPublication, getPublications, likePublication, editPublication, deletePublication, getUserPublications }