import './style/globals.css';
import {RecoilRoot} from 'recoil';
import React from 'react';
import BasePage from './pages/BasePage';
import { Box,  CssBaseline} from "@mui/material";
import Sidebar from "./components/panel/Sidebar";

function App() {
    return (
        <RecoilRoot>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                    <Sidebar/>
                <Box
                    sx={{flexGrow: 1}}
                >
                    <BasePage/>
                </Box>
            </Box>
        </RecoilRoot>
    );
}

export default App;
