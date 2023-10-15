import { atom } from "recoil";

const isLocal = window.location.hostname === 'localhost';

export const nowEnv = {
    LOCAL: 'http://localhost:8080/',
    DEV: 'https://pinner.dev/',
};


export const environmentStatus = atom({
    key: 'environmentStatus',
    default: isLocal ? nowEnv.LOCAL : nowEnv.DEV,
});