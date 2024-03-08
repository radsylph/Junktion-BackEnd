import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserInterface from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema<UserInterface>({
    name: { type: String, required: true, unique: false },
    lastname: { type: String, required: true, unique: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    profilePicture: { type: String, required: false, unique: false, default: "https://firebasestorage.googleapis.com/v0/b/junktion-effaa.appspot.com/o/profilePictures%2F1709854375771.png?alt=media&token=421bfa47-f15d-416a-bf94-3e8a1df94430" },
    myFriends: { type: Number, required: false, unique: false, default: 0 }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model<UserInterface>("User", UserSchema);

UserSchema.methods.verifyPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
export default User;
