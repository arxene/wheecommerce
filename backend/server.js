import express from "express";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;

import products from "./data/Products.js";

connectDB(); // Connect to MongoDB

const app = express();

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
});

app.listen(port, () => console.log(`Express server running on port ${port}.`));
