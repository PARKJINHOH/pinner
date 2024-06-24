import React from "react";


// components
import Sidebar from "components/panel/sidebar/Sidebar";
import CommunityPage from "components/panel/community";
import TravelPage from "pages/TravelPage";


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
                                return <TravelPage/>;
                            case 'COMMUNITY':
                                return <CommunityPage/>;
                            default:
                                return <TravelPage/>;
                        }
                    })()
                }
            </Box>
        </Box>
    )
}
