import './style/globals.css';
import { RecoilRoot } from 'recoil';
import React from 'react';
import BasePage from './pages/BasePage';

function App() {
    return (
        <RecoilRoot>
            <BasePage />
        </RecoilRoot>
    );
}

export default App;
