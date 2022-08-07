import {atom} from "recoil";

export const registerStatus = atom({
    key: 'registerStatus',
    default: false,
});

export const showRegisterStatus = atom({
    key: 'showRegisterStatus',
    default: true
});