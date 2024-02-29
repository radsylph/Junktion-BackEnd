import { Request, Response } from "express";
import passport from "passport";
import localStrategy from "passport-local";
import JWTStrategy, { ExtractJwt } from "passport-jwt";
import User from "../models/user";
import verifyPassword from "../services/auth";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

passport.use(
    "signup",
    new localStrategy.Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const { username, name, lastname } = req.body;
            try {
                const existingEmail = await User.findOne({ email: email }).exec();
                if (existingEmail) {
                    return done(null, false, {
                        message: "The email is already register",
                    });
                }
                const existingUsername = await User.findOne({ username: username }).exec();
                if (existingUsername) {
                    return done(null, false, {
                        message: "The username is already register",
                    });
                }
                const newUser = new User({ email, password, username, name, lastname });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.use(
    "login",
    new localStrategy.Strategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const userInfo = email;
                const ExistingUser = await User.findOne({ $or: [{ email: userInfo }, { username: userInfo }] }).exec();
                if (!ExistingUser) {
                    return done(null, false, { message: "The user can't be found" });
                }
                console.log(password, ExistingUser.password)
                const validate = await verifyPassword(password, ExistingUser.email);
                if (!validate) {
                    return done(null, false, { message: "the password doesn't match" });
                }
                return done(null, ExistingUser, { message: "Logged in successfully" });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy.Strategy(
        {
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

export default passport;
