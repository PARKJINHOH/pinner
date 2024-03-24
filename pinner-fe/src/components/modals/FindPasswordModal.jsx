import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

// api
import { HTTPStatus, useAPIv1 } from 'apis/traveler/apiv1';

// css
import style from './FindPasswordModal.module.css';

// component
import {errorAlert} from "components/alert/AlertComponent";
import { AuthModalVisibility, authModalVisibilityState } from 'states/modal';

// mui
import {Box, Modal, Stack, TextField, Typography, Button, CircularProgress} from "@mui/material";

export default function FindPasswordModal() {
    const apiv1 = useAPIv1();

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    function sendTempPassword(){

        setLoading(true);
        apiv1.post("/email/reset/password", JSON.stringify({nickname: nickname.trim(), email: email.trim()}))
            .then((response) => {
                if (response.status === HTTPStatus.OK) {
                    setErrorMessage('');
                    setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() =>{
                setLoading(false);
            });
    }

    return (
        <Modal
            open={modalVisibility === AuthModalVisibility.SHOW_FINDPW}
            onClose={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
        >
            <Box className={style.find_pw_box}>
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
                    <Button onClick={sendTempPassword} variant="contained" type="button" sx={{backgroundColor: '#33a4ff'}} disabled={loading}>
                        임시 비밀번호 발송
                        {loading && (
                            <Box sx={{display: 'flex', justifyContent: 'center', marginLeft: 2}}>
                                <CircularProgress size="20px" color="secondary"/>
                            </Box>
                        )}
                    </Button>
                    {
                        errorMessage && errorAlert(errorMessage)
                    }
                </Stack>
            </Box>
        </Modal>
    );
}