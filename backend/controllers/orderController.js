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
// @route   GET /api/orders/mine
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
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.status(StatusCodes.OK).json(updatedOrder);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error(`Order ${req.params.id} not found`);
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(StatusCodes.OK).json(updatedOrder);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Order not found");
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
});

export {addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders};
