import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserInterface from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema<UserInterface>({
    name: { type: String, required: true, unique: false },
    lastname: { type: String, required: true, unique: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    myFriends: { type: Number, required: false, unique: false }
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
