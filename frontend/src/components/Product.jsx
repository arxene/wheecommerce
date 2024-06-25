import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import StarRating from "./StarRating";

const Product = ({product}) => {
    return (
        // TODO: Make cards all the same height even if product.name is shorter or longer
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant="top" />
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div" className="product-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                {/* TODO: above the price, add rating stars and # of reviews */}
                <Card.Text as="div">
                    <StarRating rating={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>

                <Card.Text as="h3">${product.price}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
