import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import {HTTPStatus, useAPIv1} from "../../apis/apiv1";

// css
import style from './LoginModal.module.css';

// component
import { useDoLogin } from 'states/traveler';
import {errorAlert} from "components/alert/AlertComponent";
import { postLogin } from 'apis/auth';
import { AuthModalVisibility, authModalVisibilityState } from 'states/modal';

// mui
import {Box, Modal, Stack, TextField, Typography, Button} from "@mui/material";
import Divider from '@mui/material/Divider';

export default function FindPasswordModal() {
    const apiv1 = useAPIv1();

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    function sendTempPassword(){
        apiv1.post("/email/reset/password", JSON.stringify({nickname: nickname.trim(), email: email.trim()}))
            .then((response) => {
                if (response.status === HTTPStatus.OK) {
                    setErrorMessage('');
                    setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
                } else {
                    setErrorMessage('닉네임과 이메일을 확인해주세요.');
                }
            })
            .catch((error) => {
                setErrorMessage('닉네임과 이메일을 확인해주세요.');
            });
    }

    return (
        <div>
            <Modal
                open={modalVisibility === AuthModalVisibility.SHOW_FINDPW}
                onClose={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
            >
                <Box className={style.login_box}>
                    <Typography variant="h5" sx={{marginBottom: 3}}>
                        비밀번호 재설정
                    </Typography>
                    <Typography variant="body2" sx={{marginBottom: 3}}>
                        회원 가입시 입력하신 이메일 주소를 입력하시면, <br/>
                        해당 이메일로 임시비밀번호를 보내드립니다.
                    </Typography>
                    <Stack spacing={2} sx={{marginBottom: 1}}>
                        <TextField label="닉네임" variant="outlined" onChange={(e) => setNickname(e.currentTarget.value)} value={nickname} placeholder="Nickname" />
                        <TextField label="이메일" variant="outlined" onChange={(e) => setEmail(e.currentTarget.value)} value={email} type="email" placeholder="Email" />
                        <Button onClick={sendTempPassword} variant="contained" type="button" sx={{ backgroundColor: '#33a4ff'}}>
                            임시 비밀번호 발송
                        </Button>
                        {
                            errorMessage && errorAlert(errorMessage)
                        }
                    </Stack>
                </Box>
            </Modal>
        </div>
    );
}