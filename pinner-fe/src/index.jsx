import ReactDOM from 'react-dom/client';
import {RecoilRoot} from 'recoil';
import "./index.css";

// component
import App from 'App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
);