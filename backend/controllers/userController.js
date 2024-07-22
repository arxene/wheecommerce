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

        res.status(StatusCodes.OK).json({
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
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(StatusCodes.OK).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // for name and email, use info sent from request, but if missing, use what's already saved in DB
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // checking for password separately if sent in request body
        // if not, then we skip doing the encryption step in userModel.js
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(StatusCodes.OK).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User not found");
    }
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(StatusCodes.OK).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.status(StatusCodes.OK).json(user);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User not found");
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("Cannot delete an admin user");
        }

        await User.deleteOne({_id: user._id});
        res.status(StatusCodes.OK).json({message: "User deleted successfully"});
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User not found");
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(StatusCodes.OK).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("User not found");
    }
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
