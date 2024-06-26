import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import {Row, Col, ListGroup, Card, Button} from "react-bootstrap";
import StarRating from "../components/StarRating";

const ProductScreen = () => {
    const [product, setProduct] = useState({});
    const {id: productId} = useParams(); // get product._id from URL
    useEffect(() => {
        const fetchProduct = async () => {
            const {data} = await axios.get(`/api/products/${productId}`);
            setProduct(data);
        };

        fetchProduct();
    }, [productId]); // run effect again if productId changes

    return (
        <>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>

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
                                        <strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button className="btn-block" type="button" disabled={product.countInStock === 0}>
                                    Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductScreen;
