import { atom } from "recoil";

export const ModalVisibility = {
    HIDE_ALL: 'hide',
    SHOW_LOGIN: 'login',
    SHOW_REGISTER: 'register',
};

// ModalVisibility 수정 못하게 봉인
Object.freeze(ModalVisibility);


export const modalVisibilityState = atom({
    key: 'modalVisibilityState',
    default: ModalVisibility.HIDE_ALL,
});