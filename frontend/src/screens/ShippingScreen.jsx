import {useState, useMemo} from "react";
import {Form, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import FormContainer from "../components/FormContainer";
import {saveShippingAddress} from "../slices/cartSlice";

const ShippingScreen = () => {
    // get shipping address details from Redux state
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;

    const [address, setAddress] = useState(shippingAddress?.address || "");
    const [city, setCity] = useState(shippingAddress?.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
    const [state, setState] = useState(shippingAddress?.state || "");
    const [country, setCountry] = useState(shippingAddress?.country || "");
    const countryOptions = useMemo(() => countryList().getData(), []);
    const changeCountryHandler = (value) => {
        setCountry(value);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, state, postalCode, country}));
        navigate("/payment");
    };

    return (
        <FormContainer>
            <h1>Shipping</h1>

            <Form onSubmit={submitHandler}>
                <Form.Control
                    type="text"
                    placeholder="Street address"
                    value={address}
                    className="my-2"
                    onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>

                <Form.Control
                    type="text"
                    placeholder="City"
                    value={city}
                    className="my-2"
                    onChange={(e) => setCity(e.target.value)}
                ></Form.Control>

                <Form.Control
                    type="text"
                    placeholder="State"
                    value={state}
                    className="my-2"
                    onChange={(e) => setState(e.target.value)}
                ></Form.Control>

                <Form.Control
                    type="text"
                    placeholder="Postal code"
                    value={postalCode}
                    className="my-2"
                    onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>

                {/* <Form.Control
                    type="text"
                    placeholder="Country"
                    value={country}
                    className="my-2"
                    onChange={(e) => setCountry(e.target.value)}
                ></Form.Control> */}

                <Select options={countryOptions} value={country} onChange={changeCountryHandler} />

                <Button type="submit" variant="primary" className="my-2">
                    Continue to payment
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
