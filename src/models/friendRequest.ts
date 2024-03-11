import mongoose from "mongoose";
import { FriendRequestInterface } from "../interfaces/friendRequest.interface";

const friendRequestSchema = new mongoose.Schema<FriendRequestInterface>({
    sender: { type: String, required: true, unique: false, ref: "User" },
    receiver: { type: String, required: true, unique: false, ref: "User" },
    status: { type: String, required: true, unique: false, enum: ["pending", "accepted", "rejected"] }
});

const FriendRequest = mongoose.model<FriendRequestInterface>("FriendRequest", friendRequestSchema);

export default FriendRequest;
