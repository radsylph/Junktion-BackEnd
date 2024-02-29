import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { PublicationInterface } from "../interfaces/publication.interface";

const publicationSchema = new mongoose.Schema<PublicationInterface>({
    owner: { type: String, required: true, unique: false, refPath: "users" },
    title: { type: String, required: true, unique: false },
    content: { type: String, required: true, unique: false },
    images: { type: [String], required: false, unique: false, default: [] },
    isEdited: { type: Boolean, required: true, unique: false, default: false },
    bookMark: { type: Boolean, required: true, unique: false, default: false },
    likes: { type: Number, required: true, unique: false, default: 0 },
    comments: { type: Number, required: true, unique: false, default: 0 }

});

const Publication = mongoose.model<PublicationInterface>("Publication", publicationSchema);

export default Publication;