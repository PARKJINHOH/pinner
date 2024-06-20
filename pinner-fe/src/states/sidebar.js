import { atom } from "recoil";

/**
 * 사이드바 상태
 */
export const sidebarStateKeys = {
    MAIN: 'MAIN',
    TRAVEL: 'TRAVEL',
    COMMUNITY: 'COMMUNITY',
};

export const sidebarState = atom({
    key: 'sidebarState',
    default: '',
});