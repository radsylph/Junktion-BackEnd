import User from "../models/user";
import bcrypt from "bcrypt";

const verifyPassword = async (password: string, email: string) => {
    const usuario = await User.findOne({
        email: email,
    }).exec();
    console.log(usuario);
    if (!usuario) {
        return false;
    }
    const result = await bcrypt.compare(password, usuario.password);
    console.log(result);
    return result;
};

export default verifyPassword;
