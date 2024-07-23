import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {Row, Col, ListGroup, Card, Button, Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import StarRating from "../components/StarRating";
import {useGetProductDetailsQuery, useCreateReviewMutation} from "../slices/productsApiSlice";
import {addToOrUpdateCart} from "../slices/cartSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {toast} from "react-toastify";

const ProductScreen = () => {
    const {id: productId} = useParams(); // get product._id from URL
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);
    const [createReview, {isLoading: isReviewLoading}] = useCreateReviewMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCartHandler = () => {
        dispatch(addToOrUpdateCart({...product, qty}));
        navigate("/cart");
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({productId, rating, comment}).unwrap();
            refetch();
            toast.success("Review submitted");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <Row>
                        <Col md={5}>
                            {/* <Image> isn't loading for some reason, because of Cold Turkey?
                            <Image scr={product.image} alt={product.name} fluid />
                            */}
                            <Card.Img src={product.image} variant="top" />
                        </Col>

                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <StarRating rating={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>

                                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>
                                                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                                                </strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e.target.value))}
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button
                                            className="btn-block"
                                            type="button"
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="review">
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No reviews</Message>}
                            <ListGroup variant="flush">
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <StarRating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h2>Write a customer review.</h2>

                                    {isReviewLoading && <Loader />}

                                    {/* userInfo indicates whether they're logged in or not */}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="rating" className="my-2">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value=""></option>
                                                    <option value="1">1 - Poor</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="4">4 - Very Good</option>
                                                    <option value="5">5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="comment" className="my-2">
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    row="3"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>

                                            <Button disabled={isReviewLoading} type="submit" variant="primary">
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            Please <Link to="/login">sign in</Link> to write a review.
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductScreen;
