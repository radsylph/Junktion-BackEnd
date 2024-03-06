import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { LikeInterface } from "../interfaces/like.interface";


const likeSchema = new mongoose.Schema<LikeInterface>({
    userId: { type: String, required: true, unique: false, ref: "User" },
    publicationId: { type: String, required: true, unique: false, ref: "Publication" }
});

const Like = mongoose.model<LikeInterface>("Like", likeSchema);

export default Like;
