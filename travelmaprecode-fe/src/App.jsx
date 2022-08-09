import './style/globals.css'
import GoogleMapApi from "./pages/google/GoogleMapApi";
import { RecoilRoot } from "recoil";

function App() {
    return (
        <RecoilRoot>
            <GoogleMapApi />
        </RecoilRoot>
    );
}

export default App;
