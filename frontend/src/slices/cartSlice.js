import {createSlice} from "@reduxjs/toolkit";
import {updateCart} from "../utils/cartUtils";

// check local storage to see if there are items in their cart from before
const initialState = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {cartItems: [], shippingAddress: {}, paymentMethod: "PayPal=]]"};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToOrUpdateCart: (state, action) => {
            const itemToAdd = action.payload;

            // need to check if item already in cart to properly update quantity
            const existingCartItem = state.cartItems.find((x) => x._id === itemToAdd._id);

            // update cart quantity
            if (existingCartItem) {
                state.cartItems = state.cartItems.map((x) => (x._id === existingCartItem._id ? itemToAdd : x));
            } else {
                // add new item to any other items already in the cart
                state.cartItems = [...state.cartItems, itemToAdd];
            }

            return updateCart(state); // updates local storage
        },
        removeFromCart: (state, action) => {
            // When they click the trash icon on the Cart page, remove that item from the cart
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);

            return updateCart(state); // updates local storage
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
    },
});

export const {addToOrUpdateCart, removeFromCart, saveShippingAddress} = cartSlice.actions;

export default cartSlice.reducer;
