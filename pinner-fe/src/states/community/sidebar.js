import { atom } from "recoil";

/**
 * 사이드바 상태
 */
export const commStateKeys = {
    MAIN: 'MAIN',
    NOTICE: 'NOTICE',
    COMMUNITY: 'COMMUNITY',
    TRAVEL: 'TRAVEL',
    QNA: 'QNA',
};

export const commState = atom({
    key: 'commState',
    default: '',
});