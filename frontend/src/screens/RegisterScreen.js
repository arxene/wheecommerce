import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Form, Button, Row, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import {useRegisterMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isRegistering}] = useRegisterMutation();

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

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await register({name, email, password}).unwrap();
            dispatch(setCredentials({...res})); // puts userInfo in local storage
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Register Account</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="my-3">
                    <Form.Control
                        type="text"
                        placeholder="First last name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="my-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="my-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="my-3">
                    <Form.Control
                        type="password"
                        placeholder="Re-type Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-2" disabled={isRegistering}>
                    Register
                </Button>

                {isRegistering && <Loader />}
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;
