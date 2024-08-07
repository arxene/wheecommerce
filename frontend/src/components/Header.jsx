import {Badge, Nav, Navbar, Container, NavDropdown} from "react-bootstrap";
import {FaShoppingCart, FaUser} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import logo from "../assets/wc-high-resolution-logo-white-transparent.png";

const Header = () => {
    const {cartItems} = useSelector((state) => state.cart); // the name cart comes from store.js
    const {userInfo} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout()); // clear local storage
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="sm" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand href="/">
                            <img src={logo} alt="WheeCommerce logo" />
                            WheeCommerce
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* ms-auto aligns to the right */}
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <FaShoppingCart /> Cart
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="success" style={{marginLeft: "5px"}}>
                                            {cartItems.reduce((accumulator, current) => accumulator + current.qty, 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Sign Out</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <FaUser /> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="adminMenu">
                                    <LinkContainer to="/admin/productList">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/userList">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/orderList">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
