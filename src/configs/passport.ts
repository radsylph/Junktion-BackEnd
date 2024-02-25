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
            const { username } = req.body;
            try {
                const existingEmail = await User.findOne({ email: email }).exec();
                if (existingEmail) {
                    return done(null, false, {
                        message: "The email is already register",
                    });
                }
                const newUser = new User({ email, password, username });
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
                const ExistingUser = await User.findOne({ email: email }).exec();
                if (!ExistingUser) {
                    return done(null, false, { message: "The email cannot be found" });
                }
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
