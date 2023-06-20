import { atom } from "recoil";


/**
 * 사이드바(Sidebar) 너비
 */
export const sidebarWidth = atom({
    key: 'sidebarWidth',
    default: 70,
});

/**
 * 여행(Travel)목록 너비
 */
export const travelListViewWidth = atom({
    key: 'travelListViewWidth',
    default: 280,
});

/**
 * 여정(Journey)목록 너비, 여정(Journey)글쓰기
 */
export const journeyListViewWidth = atom({
    key: 'journeyListViewWidth',
    default: 350
});