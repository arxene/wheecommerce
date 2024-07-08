import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Form, Button, Row, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import {useLoginMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoggingIn}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    // check if we need to redirect to a different page after login
    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get("redirect") || "/"; // if no ?redirect= then default to /
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await login({email, password}).unwrap();
            dispatch(setCredentials({...res})); // puts userInfo in local storage
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-2" disabled={isLoggingIn}>
                    Sign In
                </Button>

                {isLoggingIn && <Loader />}
            </Form>

            <Row className="py-3">
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default LoginScreen;
