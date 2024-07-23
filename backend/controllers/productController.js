import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import {StatusCodes} from "http-status-codes";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 2;
    const currentPage = Number(req.query.pageNumber) || 1;
    const totalNumberOfProducts = await Product.countDocuments();

    const products = await Product.find({})
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1));

    res.json({products, currentPage, numPages: Math.ceil(totalNumberOfProducts / pageSize)});
});

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error(`Product ID ${req.params.id} not found.`);
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description",
    });

    const createdProduct = await product.save();
    res.status(StatusCodes.CREATED).json(createProduct);
});

// @desc    Get all products
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Resource not found");
    }
});

// @desc    Delete a products
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({_id: product._id});
        res.status(StatusCodes.OK).json({message: "Product deleted"});
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Resource not found");
    }
});

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const productAlreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (productAlreadyReviewed) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("You have already reviewed this product.");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        // calculate the average rating
        product.rating =
            product.reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(StatusCodes.CREATED).json({message: "Review successfully added!"});
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Resource not found");
    }
});

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview};
