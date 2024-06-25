import {Nav, Navbar, Container} from "react-bootstrap";
import {FaShoppingCart, FaUser} from "react-icons/fa";

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="sm" collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/">WheeCommerce</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* ms-auto aligns to the right */}
                        <Nav className="ms-auto">
                            <Nav.Link href="/cart">
                                <FaShoppingCart /> Cart
                            </Nav.Link>
                            <Nav.Link href="/login">
                                <FaUser /> Sign In
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
