import {Container, Row, Col} from "react-bootstrap";

const Footer = () => {
    // show current year for copyright
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p>WheeCommerce &copy; {currentYear}</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
