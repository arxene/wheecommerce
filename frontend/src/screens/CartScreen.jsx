import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, ListGroup, Image, Form, Button, Card} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import Message from "../components/Message";

// TODO: Show product image, product name, price, quantity incl. a dropdown to change the quantity, and a trash
// button to remove from cart.On the right show a total quantity, subtotal price, and a Proceed To Checkout button
const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return <div>CartScreen</div>;
};

export default CartScreen;
