import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"});

    // Set JWT as HTTP-only cookie
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // only true in production because HTTPS needed
        sameSite: "strict",
        maxAge: thirtyDaysInMilliseconds,
    });
};

export default generateToken;
