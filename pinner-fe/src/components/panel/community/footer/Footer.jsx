import React from 'react';

// component

// mui
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";

// css
import style from './Footer.module.css';

export default function Footer() {

    return (
        <div className={style.wrap}>
            <Divider/>
        </div>
    );
}
