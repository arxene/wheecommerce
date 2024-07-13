import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import {StatusCodes} from "http-status-codes";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("No items in order");
    } else {
        const order = new Order({
            orderItems: orderItems.map((orderItem) => ({
                ...orderItem,
                product: orderItem._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(StatusCodes.CREATED).json(createdOrder);
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const myOrders = await Order.find({user: req.user._id});

    if (myOrders) {
        res.status(StatusCodes.OK).json(myOrders);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error(`Order (${req.params.id}) not found`);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    // get order as well as user's name and email
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
        res.status(StatusCodes.OK).json(order);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error(`Order (${req.params.id}) not found`);
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    res.send("update order to paid");
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send("update order to delivered");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    res.send("get all orders");
});

export {addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders};
