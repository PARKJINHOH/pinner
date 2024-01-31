import React from 'react';
import {useAPIv1} from "apis/apiv1";

// component

// mui

// css
import style from './Dashboard.module.css';

export default function Dashboard() {

    return (
        <div className={style.home}>
            신규 User 차트{/*<UserChart />*/}
        </div>
    );
}
