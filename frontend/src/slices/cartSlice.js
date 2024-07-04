import {createSlice} from "@reduxjs/toolkit";
import {updateCart} from "../utils/cartUtils";

// check local storage to see if there are items in their cart from before
const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: []};

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

            // Calculate item price
            return updateCart(state);
        },
    },
});

export const {addToOrUpdateCart} = cartSlice.actions;

export default cartSlice.reducer;
