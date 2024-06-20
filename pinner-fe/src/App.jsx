import React from 'react';

// component
import 'pages/TravelPage';
import MainApp from "components/panel/travel/MainApp";

// mui
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AfterOAuthHandler from "./pages/AfterOAuthHandler";
import AuthProvider from "./admin/provider/AuthProvider";
import AuthRoutes from "./admin/routes/AuthRoutes";

export default function App() {

    return (
        <>
            <AuthProvider>
                <AuthRoutes/>
            </AuthProvider>
        </>
    );
}