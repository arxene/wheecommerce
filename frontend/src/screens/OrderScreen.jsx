import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Image, Card, Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
    const {id: orderId} = useParams(); // get order ID from URL
    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);

    const [payOrder] = usePayOrderMutation();

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();

    const {userInfo} = useSelector((state) => state.auth);

    // load PayPal script
    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    },
                });

                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            };

            // if order isn't paid yet and the PayPal script isn't already loaded, load the script
            if (order && !order.isPaid && !window.paypal) {
                console.log("loadPayPalScript()");
                loadPayPalScript();
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({orderId, details});
                refetch(); // refetch so Message says it's paid now
                toast.success("Payment successful");
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        });
    };

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: order.totalPrice,
                        },
                    },
                ],
            })
            .then((orderId) => {
                return orderId;
            });
    };

    const onError = (err) => {
        toast.error(err.message);
    };

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order delivered");
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger" />
    ) : (
        <>
            <h1>Order {order._id}</h1>

            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong>
                                {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                {order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? (
                                <Message variant="success">Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant="danger">Not delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                <Message variant="success">Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant="danger">Not paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>

                                        <Col>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </Col>

                                        <Col md={4}>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Subtotal:</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping:</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax:</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total:</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPayPal || isPending ? (
                                            <Loader />
                                        ) : (
                                            <div>
                                                <div>
                                                    <PayPalButtons
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    ></PayPalButtons>
                                                </div>
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                )}

                                {loadingDeliver && <Loader />}

                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
