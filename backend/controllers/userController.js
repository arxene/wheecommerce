import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import {StatusCodes} from "http-status-codes";
import generateToken from "../utils/generateToken.js";

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (user && (await user.isPasswordValid(password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("Invalid email or password");
    }

    res.send("login user");
});

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const userAlreadyExists = await User.findOne({email});

    if (userAlreadyExists) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("User already exists");
    }

    const newUser = await User.create({
        name,
        email,
        password,
    });

    if (newUser) {
        // user registration successful
        // login as new user, create JWT cookie
        generateToken(res, newUser._id);

        res.status(StatusCodes.CREATED).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } else {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Invalid user data");
    }
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // clear the JWT login cookie
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(StatusCodes.OK).json({message: "Logged out successfully"});
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    res.send("get user profile");
});

// @desc    Update user profile
// @route   PUT /api/users/profile (TODO: doesn't need :id because will use JWT token to update their profile)
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    res.send("update user profile");
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send("get users");
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    res.send("get user by id");
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    res.send("delete user");
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    res.send("update user");
});

export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
};
