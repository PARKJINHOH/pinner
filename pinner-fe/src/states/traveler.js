import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { clearTraveler, loadTraveler, saveTraveler } from './webstore';
import {postLogout} from "apis/auth";


// Load Traveler from Web storage.
// Used to initialize travelerState.
const loadTravelerFromWebStorage = selector({
    key: "loadTravelerFromWebStorage",
    get: ({ get }) => loadTraveler(),
});


export const travelerState = atom({
    key: 'travelerState',
    default: loadTravelerFromWebStorage,
});

export const isLoggedInState = selector({
    key: 'isLoggedInState',
    get: ({ get }) => {
        return get(travelerState) !== null;
    },
});


export function useDoLogout() {
    const [traveler, setTraveler] = useRecoilState(travelerState);

    return function doLogout() {
        const token = {
            refreshToken: window.sessionStorage.getItem("refreshToken"),
        };

        postLogout(token)
            .then(response => {
                alert("정상적으로 로그아웃 되었습니다.");
            })
            .catch((error) => {
                alert("에러가 발생했습니다. 관리자에게 문의주세요.");
            });

        setTraveler(null);
        clearTraveler();
    }
}

export function useDoLogin() {
    const setTraveler = useSetRecoilState(travelerState);

    return function doLogin(traveler) {
        setTraveler(traveler);

        saveTraveler(traveler);
    }
}