export const toDollarAmount = (num) => {
    return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const updateCart = (state) => {
    // Add price value for all items in cart
    state.itemsPrice = toDollarAmount(
        state.cartItems.reduce((accumulator, item) => accumulator + item.price * item.qty, 0)
    );

    // Calculate shipping (if order > $100 then free, else $10 shipping)
    state.shippingPrice = toDollarAmount(state.itemsPrice > 100 ? 0 : 10);

    // Calculate tax (15% tax)
    // BUG: Fix taxPrice or toDollarAmount which is only showing 1 decimal place
    // Can see with 1 gaming mouse and 2 DSLR cameras in cart. Tax price in cart is set to 286.5
    // Instead it should be 286.50
    state.taxPrice = toDollarAmount(Number(0.15 * state.itemsPrice));

    // Calculate total price
    state.totalPrice = toDollarAmount(state.itemsPrice + state.shippingPrice + state.taxPrice);

    // Save cart to local storage
    localStorage.setItem("cart", JSON.stringify(state));

    return state;
};
