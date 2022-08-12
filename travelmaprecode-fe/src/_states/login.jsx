import { atom } from 'recoil';

export const ModalVisibility = {
    HIDE: 'hide',
    LOGIN: 'login',
    REGISTER: 'register',
};

// ModalVisibility 수정 못하게 봉인
Object.freeze(ModalVisibility);

export const modalVisibilityState = atom({
    key: 'modalVisibilityState',
    default: ModalVisibility.HIDE,
});

// 로그인 되었는지 여부
// 로그인/회원가입/로그아웃 버튼 보이고 감추는데 사용
export const loginState = atom({
    key: 'buttonVisibilityState',
    default: false,
});
