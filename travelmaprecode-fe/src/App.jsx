import './style/globals.css';
import { RecoilRoot } from 'recoil';
import React from 'react';
import BasePage from './pages/BasePage';
import Sidebar from './components/sidebar/Sidebar';

function App() {
    return (
        <RecoilRoot>
            <BasePage />
            <Sidebar />
        </RecoilRoot>
    );
}

export default App;
