import React from 'react';

// css
import './style/globals.css';

// component
import BasePage from './pages/BasePage';
import Sidebar from "./components/panel/sidebar/Sidebar";

// mui
import { Box, CssBaseline } from "@mui/material";

function App() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Sidebar />
            <Box
                sx={{ flexGrow: 1 }}
            >
                <BasePage />
            </Box>
        </Box>
    );
}

export default App;
