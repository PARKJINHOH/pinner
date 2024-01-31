import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

// component
import AdminLogin from "admin/AdminLogin";
import {useAuth} from "admin/provider/AuthProvider";
import {ProtectedRoute} from "admin/routes/ProtectedRoute";
import Dashboard from "admin/components/dashboard/Dashboard";
import MainApp from "components/panel/travel/MainApp";
import AfterOAuthHandler from "pages/AfterOAuthHandler";
import AdminApp from "../components/AdminApp";

// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
export default function AuthRoutes() {

    const {token} = useAuth();

    // 모든 사용자가 액세스할 수 있는 공용 경로 정의
    const routesForPublic = [
        {
            path: "/",
            element: <MainApp/>,
        },
        {
            path: "/afteroauth",
            element: <AfterOAuthHandler/>,
        },
    ];

    // 인증되지 않은 사용자만 액세스할 수 있는 경로 정의
    const routesForNotAuthenticatedOnly = [
        {
            path: "/admin/login",
            element: <AdminLogin/>,
        },
    ];

    // 인증된 사용자만 액세스할 수 있는 경로 정의
    const routesForAuthenticatedOnly = [
        {
            path: "/admin",
            element: <ProtectedRoute/>, // Wrap the component in ProtectedRoute
            children: [
                {
                    path: "/admin",
                    element: <AdminApp/>,
                },
                {
                    path: "/admin/dashboard",
                    element: <Dashboard/>,
                },
                {
                    path: "/admin/profile",
                    element: <div>User Profile</div>,
                },
                // {
                //     path: "/logout",
                //     element: <Logout/>,
                // },
            ],
        },
    ];


    // 인증 상태에 따라 경로로 이동, 순서 중요
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router}/>;
};
