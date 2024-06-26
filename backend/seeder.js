import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

await connectDB();

const importData = async () => {
    try {
        // delete all
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // seed DB Users and Products tables from JS data files
        const createdUsers = await User.insertMany(users);

        const adminUserId = createdUsers.find((user) => user.isAdmin === true)._id;
        const sampleProducts = products.map((product) => {
            return {...product, user: adminUserId};
        });
        const createdProducts = await Product.insertMany(sampleProducts);

        console.log("Data imported to DB".green.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        // delete all
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log("Deleted data from Order, Product, and User tables".red.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}.red.inverse`);
        process.exit(1);
    }
};

// by default, seed the DB. Only delete if option -del is passed
if (process.argv[2] === "-del") {
    deleteData();
} else {
    importData();
}
