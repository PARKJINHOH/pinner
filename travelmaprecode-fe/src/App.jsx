import './style/globals.css'
import GoogleMapApi from "./pages/google/GoogleMapApi";
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue} from "recoil";

function App() {
    return (
        <RecoilRoot>
            <GoogleMapApi/>
        </RecoilRoot>
    );
}

export default App;
