import {atom} from "recoil";

export const loginStatus = atom({
    key: 'loginStatus',
    default: false
});

export const showLoginStatus = atom({
    key: 'showLoginStatus',
    default: true
});