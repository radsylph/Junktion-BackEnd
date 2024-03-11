import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { FriendInterface } from "../interfaces/friendRequest.interface";


const friendSchema = new mongoose.Schema<FriendInterface>({
    mySelf: { type: String, required: true, unique: false, ref: "User" },
    myFriend: { type: String, required: true, unique: false, ref: "User" }
});

const Friend = mongoose.model<FriendInterface>("Friend", friendSchema);

export default Friend;
