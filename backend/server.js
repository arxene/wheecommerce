import express from "express";
import products from "./data/Products.js";
const port = 5000;

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
