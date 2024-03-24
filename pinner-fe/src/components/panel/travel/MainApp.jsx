import React from "react";


// components
import Sidebar from "components/panel/sidebar/Sidebar";
import BasePage from "pages/BasePage";

// mui
import {Box, CssBaseline} from "@mui/material";

// css
import "react-toastify/dist/ReactToastify.css";

export default function MainApp() {
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Sidebar/>
            <Box sx={{flexGrow: 1}}>
                <BasePage/>
            </Box>
        </Box>
    )
}
