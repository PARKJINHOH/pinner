import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

// component
import AdminLogin from "admin/AdminLogin";
import {useAuth} from "admin/provider/AuthProvider";
import {ProtectedRoute} from "admin/routes/ProtectedRoute";
import Dashboard from "admin/components/dashboard/Dashboard";
import Notice from "admin/components/notice/Notice";
import NoticeWrite from "admin/components/notice/NoticeWrite";

import Users from "admin/components/users/Users";
import MainApp from "components/panel/travel/MainApp";
import ErrorPage from "components/error/ErrorPage";
import ErrorPageAdmin from "admin/components/error/ErrorPageAdmin";
import AfterOAuthHandler from "pages/AfterOAuthHandler";
import PublicShared from "pages/PublicSharedPage";

export default function AuthRoutes() {

    const {token} = useAuth();

    // 모든 사용자가 액세스할 수 있는 공용 경로 정의
    const routesForPublic = [
        {
            path: "/",
            element: <MainApp/>,
            errorElement: <ErrorPage />, // 전역 Error Page
        },
        {
            path: "/afteroauth",
            element: <AfterOAuthHandler/>,
        },
        {
            path: "/shared/:shareCode",
            element: <PublicShared />,
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
            element: <ProtectedRoute/>,
            children: [
                {
                    path: "*",
                    element: <ErrorPageAdmin/>,
                },
                {
                    path: "/admin",
                    element: <Dashboard/>,
                },
                {
                    path: "/admin/notice",
                    element: <Notice/>,
                },
                {
                    path: "/admin/notice/:idx",
                    element: <NoticeWrite/>,
                },
                {
                    path: "/admin/notice/write",
                    element: <NoticeWrite/>,
                },
                {
                    path: "/admin/dashboard",
                    element: <Dashboard/>,
                },
                {
                    path: "/admin/users",
                    element: <Users/>
                },
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
