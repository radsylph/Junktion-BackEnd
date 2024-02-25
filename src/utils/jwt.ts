import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const generateToken = (user: any) => {
    console.log(user);
    return jwt.sign({ user }, process.env.SECRET, {
        expiresIn: process.env.TIME,
    });
};

const decryptToken = (token: string) => {
    return jwt.verify(token, process.env.SECRET);
};

export { generateToken, decryptToken };
