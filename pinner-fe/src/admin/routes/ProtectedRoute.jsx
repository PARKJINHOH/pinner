import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "admin/provider/AuthProvider";

export const ProtectedRoute = () => {
    const {token} = useAuth();

    if (!token) {
        return <Navigate to="/admin/login"/>;
    }

    // 인증된 경우 하위 경로 렌더링
    return <Outlet/>;
};