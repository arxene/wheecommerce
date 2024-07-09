import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = () => {
    const {userInfo} = useSelector((state) => state.auth);

    // If logged in Outlet will show whatever screen we want to load
    // If not logged in, redirect to login screen. Replace any past history
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
