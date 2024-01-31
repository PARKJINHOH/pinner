import React from 'react';
import {useAPIv1} from "apis/apiv1";

// component
import Topbar from "./topbar/Topbar";
import Dashboard from "./dashboard/Dashboard";

// css
import style from './AdminApp.module.css';
import Sidebar from "./sidebar/Sidebar";


export default function AdminApp() {

    return (
        <>
            <Topbar/>
            <div className={style.container}>
                <Sidebar/>
                <Dashboard/>
            </div>
        </>
    );
}
