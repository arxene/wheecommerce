import {Row, Col} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Product from "../components/Product";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
    const {pageNumber, keyword} = useParams(); // get page# from URL
    const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <h1>Latest Products</h1>

                    <Row>
                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>

                    <Paginate
                        numPages={data.numPages}
                        currentPage={data.currentPage}
                        keyword={keyword ? keyword : ""}
                    />
                </>
            )}
        </>
    );
};

export default HomeScreen;
