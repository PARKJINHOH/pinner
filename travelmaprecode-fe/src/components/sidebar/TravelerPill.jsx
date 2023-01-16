import React, { useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAPIv1 } from '../../apis/apiv1';
import { AuthModalVisibility, authModalVisibilityState } from '../../states/modal';
import { travelState } from '../../states/travel';
import { isLoggedInState, travelerState, useDoLogout } from '../../states/traveler';
import './TravelerPill.css';

export default function TravelerPill() {

    const traveler = useRecoilValue(travelerState);
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const doLogout = useDoLogout();

    const setModalVisibility = useSetRecoilState(authModalVisibilityState);

    // Traveler 상태 변화시 Travel 데이터를 패칭하거나 삭제합니다.
    // useEffect를 사용하기 위해서 사용자의 상태가 변하면 다시 렌더링되는 컴포넌트에 로직을 위치했지만,
    // 나중에 다른곳으로 옮기는것이 나을 수 있습니다.
    const setTravels = useSetRecoilState(travelState);
    const apiv1 = useAPIv1();

    // GET /api/v1/travel
    useEffect(() => {
        if (!traveler) {
            setTravels([]);
            return;
        }

        apiv1.get("/travel")
            .then(resp => {
                setTravels(resp.data);
            })
            .catch(error => {
                console.error(`can not load data: ${error}`);
                setTravels([]);
            });
    }, [traveler]);



    return (
        <Dropdown>
            <hr></hr>
            <Dropdown.Toggle id='traveler-dropdown-toggle' className="align-items-center e-caret-hide">
                {isLoggedIn && <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />}
                <strong>{isLoggedIn ? traveler.email : "시작하기"} </strong>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    isLoggedIn ?
                        <Dropdown.Item onClick={doLogout} > 로그아웃</Dropdown.Item>
                        :
                        <>
                            <Dropdown.Item onClick={() => setModalVisibility(AuthModalVisibility.SHOW_LOGIN)}>로그인</Dropdown.Item>
                            <Dropdown.Item onClick={() => setModalVisibility(AuthModalVisibility.SHOW_REGISTER)}>회원가입</Dropdown.Item>
                        </>
                }
            </Dropdown.Menu>
        </Dropdown >
    );
}
