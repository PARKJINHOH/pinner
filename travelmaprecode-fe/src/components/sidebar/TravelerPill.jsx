import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAPIv1 } from '../../apis/apiv1';
import { AuthModalVisibility, authModalVisibilityState } from '../../states/modal';
import { travelState } from '../../states/travel';
import { isLoggedInState, travelerState, useDoLogout } from '../../states/traveler';
import './TravelerPill.css';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import { Button, Stack } from "@mui/material";
import { Avatar } from "@mantine/core";

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
        <div>
            <hr />
            <Stack direction="row" spacing={1}
                sx={{ marginBottom: 2 }}
                justifyContent="center"
            >
                {
                    isLoggedIn ?
                        <>
                            <Button variant="outlined" startIcon={<Avatar sx={{ width: 28, height: 28 }} alt="Remy Sharp" src="https://github.com/mdo.png" />}>
                                {traveler.email}
                            </Button>
                            <Button variant="outlined" startIcon={<LogoutIcon />}
                                onClick={doLogout}>
                                로그아웃
                            </Button>
                        </>
                        :
                        <>
                            <Button variant="outlined" startIcon={<SensorOccupiedIcon />}
                                onClick={() => setModalVisibility(AuthModalVisibility.SHOW_LOGIN)}>
                                로그인
                            </Button>
                            <Button variant="outlined" startIcon={<LoginIcon />}
                                onClick={() => setModalVisibility(AuthModalVisibility.SHOW_REGISTER)}>
                                회원가입
                            </Button>
                        </>
                }
            </Stack>
        </div>
    );
}
