import React from "react";
import {Navigate, Outlet} from "react-router-dom";

import {useAuth} from "admin/provider/AuthProvider";

import Topbar from "admin/components/topbar/Topbar";
import Sidebar from "admin/components/sidebar/Sidebar";

import style from "./ProtectedRoute.module.css";

export const ProtectedRoute = () => {
    const {token} = useAuth();

    if (!token) {
        return <Navigate to="/admin/login"/>;
    }

    // 인증된 경우 하위 경로 렌더링
    return (
        <>
            <Topbar/>
            <div className={style.sidebar}>
                <Sidebar/>
                <div className={style.container}>
                    <Outlet/>
                </div>
            </div>
        </>
    );
};