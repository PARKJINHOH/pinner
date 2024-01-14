import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { clearAdmin, loadAdmin, saveAdmin } from './adminWebstore';
import {postLogout} from "apis/auth";


// Load Admin from Web storage.
// Used to initialize adminState.
const loadAdminFromWebStorage = selector({
    key: "loadAdminFromWebStorage",
    get: ({ get }) => loadAdmin(),
});


export const adminState = atom({
    key: 'adminState',
    default: loadAdminFromWebStorage,
});

export const isLoggedInAdminState = selector({
    key: 'isLoggedInAdminState',
    get: ({ get }) => {
        return get(adminState) !== null;
    },
});


export function useDoLogout() {
    const [admin, setAdmin] = useRecoilState(adminState);

    return function doLogout() {
        const token = {
            refreshToken: window.sessionStorage.getItem("refreshToken"),
        };

        postLogout(token)
            .then(response => {
                alert(response.data);
            })
            .catch((error) => {
                alert(error.response.data.message);
            });

        setAdmin(null);
        clearAdmin();
    }
}

export function useDoLogin() {
    const setAdmin = useSetRecoilState(adminState);

    return function doLogin(admin) {
        setAdmin(admin);

        saveAdmin(admin);
    }
}