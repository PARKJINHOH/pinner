import { atom } from "recoil";

///
/// 프로필, 로그인, 회원가입상태
///

export const AuthModalVisibility = {
    HIDE_ALL: 'hide',
    SHOW_LOGIN: 'login',
    SHOW_REGISTER: 'register',
    SHOW_PROFILE: 'profile',
    SHOW_FINDPW: 'findpwd'
};

// ModalVisibility 수정 못하게 봉인
Object.freeze(AuthModalVisibility);


export const authModalVisibilityState = atom({
    key: 'modalVisibilityState',
    default: AuthModalVisibility.HIDE_ALL,
});



///
/// New Journey 상태
///

/**
 * NewJourney 모달 보이기 여부와 지도 클릭시 지오코딩 API 요청 여부 제어
 *
 * |NewJourneyStep | 모달 보임 | 지오코딩 요청 |
 * |---------------|-----------|---------------|
 * | NONE          | X         | X             |
 * | LOCATING      | X         | O             |
 * | EDITTING      | O         | X             |
 *
 * @enum {string}
 * @see {@link newJourneyStepState}
 */
export const NewJourneyStep = {
    NONE: 'none',
    LOCATING: 'locating',
    EDITTING: 'editting',
};

/**
 * NewJourney 모달 표시 여부와 지도 클릭시 지오코딩 API 요청 여부를 결정하는 상태
 * @see {@link NewJourneyStep}
 * @type {import("recoil").RecoilState<NewJourneyStep>}
 *
 * [타입 힌트]{@link https://github.com/microsoft/TypeScript/issues/27387#issuecomment-743449037}
 */
export const newJourneyStepState = atom({
    key: 'newJourneyStepState',
    default: NewJourneyStep.NONE,
});

/**
 * Journey 생성에 필요한 장소 상태
 */
export const newLocationState = atom({
    key: 'newLocationState',
    default: {
        lat: 0,
        lng: 0,
        name: "",
    },
});
