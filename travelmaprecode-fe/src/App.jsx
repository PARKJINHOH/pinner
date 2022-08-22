import './style/globals.css';
import { RecoilRoot } from 'recoil';
import React from 'react';
import GoogleMapApi from './pages/google/GoogleMapApi';

function App() {
    return (
        <RecoilRoot>
            <GoogleMapApi />
        </RecoilRoot>
    );
}

export default App;
