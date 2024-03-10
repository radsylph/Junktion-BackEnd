import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { BookMarkInterface } from "../interfaces/bookMark.interface";


const BookMarkSchema = new mongoose.Schema<BookMarkInterface>({
    userId: { type: String, required: true, unique: false, ref: "User" },
    publicationId: { type: String, required: true, unique: false, ref: "Publication" }
});

const BookMark = mongoose.model<BookMarkInterface>("BookMark", BookMarkSchema);

export default BookMark;
