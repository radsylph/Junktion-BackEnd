import { Request, Response, NextFunction } from "express";
import Publication from "../models/publication";
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

    } catch (error) {

    }
}


export { createPublication, getPublications }