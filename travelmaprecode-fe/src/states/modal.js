import { atom } from "recoil";

export const AuthModalVisibility = {
    HIDE_ALL: 'hide',
    SHOW_LOGIN: 'login',
    SHOW_REGISTER: 'register',
};

// ModalVisibility 수정 못하게 봉인
Object.freeze(AuthModalVisibility);


export const authModalVisibilityState = atom({
    key: 'modalVisibilityState',
    default: AuthModalVisibility.HIDE_ALL,
});