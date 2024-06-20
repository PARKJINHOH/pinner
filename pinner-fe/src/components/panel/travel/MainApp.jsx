import React from "react";


// components
import Sidebar from "components/panel/sidebar/Sidebar";
import BasePage from "pages/BasePage";


import {useRecoilValue} from "recoil";
import {sidebarState} from 'states/sidebar';

// mui
import {Box, CssBaseline} from "@mui/material";

// css
import "react-toastify/dist/ReactToastify.css";

export default function MainApp() {
    const sidebar = useRecoilValue(sidebarState);

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Sidebar/>
            <Box sx={{flexGrow: 1}}>
                {
                    (() => {
                        switch (sidebar) {
                            case 'TRAVEL':
                                return <BasePage/>;
                            case 'COMMUNITY':
                                return <div>커뮤니티</div>;
                            default:
                                return <BasePage/>;
                        }
                    })()
                }
            </Box>
        </Box>
    )
}
