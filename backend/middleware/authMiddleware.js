import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
import {StatusCodes} from "http-status-codes";

// protect routes for registered users
const protect = asyncHandler(async (req, res, next) => {
    // read the JWT from the cookie
    let token = req.cookies.jwt;

    if (token) {
        try {
            // decode token to get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from DB that matches the user ID
            req.user = await User.findById(decoded.userId).select("-password");
            next(); // go to next piece of middleware
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.UNAUTHORIZED);
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("Not authorized, no token");
    }
});

// requires admin to access route
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("Not authorized as admin user");
    }
};

export {protect, admin};
