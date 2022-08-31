import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ModalVisibility, modalVisibilityState } from '../../states/modal';
import { isLoggedInState, travelerState, useDoLogout } from '../../states/traveler';

export default function TravelerPill() {

    const traveler = useRecoilValue(travelerState);
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const doLogout = useDoLogout();

    const setModalVisibility = useSetRecoilState(modalVisibilityState);

    return (
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
                <strong>
                    {
                        isLoggedIn
                        ? ( 
                            traveler.email
                        ) : (
                            "시작하기"
                        )
                    }
                </strong>
            </a>
            <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                {
                    isLoggedIn
                        ? (
                            <li><a class="dropdown-item" onClick={doLogout}>로그아웃</a></li>
                        )
                        : (
                            <>
                                <li><a class="dropdown-item" onClick={() => setModalVisibility(ModalVisibility.SHOW_LOGIN)}>로그인</a></li>
                                <li><a class="dropdown-item" onClick={() => setModalVisibility(ModalVisibility.SHOW_REGISTER)}>회원가입</a></li>
                            </>
                        )
                }
                <li><hr class="dropdown-divider" /></li>
            </ul>
        </div>
    );
}
