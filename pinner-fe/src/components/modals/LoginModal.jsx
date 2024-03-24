import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

// css
import style from './LoginModal.module.css';

// component
import { useDoLogin } from 'states/traveler';
import {errorAlert} from "components/alert/AlertComponent";
import { postLogin } from 'apis/traveler/auth';
import { AuthModalVisibility, authModalVisibilityState } from 'states/modal';

// mui
import {Box, Modal, Stack, TextField, Typography, Button, IconButton} from "@mui/material";
import Divider from '@mui/material/Divider';

// image
import NaverLoginBtn from 'assets/images/login_icon_naver.png';
import GoogleLoginBtn from 'assets/images/login_icon_google.png';

export default function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const doLogin = useDoLogin();

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmit = async () => {
        if (email == null || email == '' || email == undefined) {
            setErrorMessage('이메일을 확인해주세요.');
            return;
        }

        if (password == null || password == '' || password == undefined) {
            setErrorMessage('비밀번호 확인해주세요.');
            return;
        }

        const data = JSON.stringify({
            email, password,
        });

        postLogin(data)
            .then((response) => {
                const payload = response.data;

                doLogin({
                    email: payload.email,
                    nickname: payload.nickname,
                    accessToken: payload.accessToken,
                    refreshToken: payload.refreshToken,
                    signupServices: payload.signupServices,
                });

                // 로그인 모달 감춤
                setModalVisibility(AuthModalVisibility.HIDE_ALL);
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
            });
    };

    function findPw(){
        setModalVisibility(AuthModalVisibility.SHOW_FINDPW);
    }

    function findNickname(){
        setModalVisibility(AuthModalVisibility.SHOW_FINDNICKNAME);
    }

    return (
        <div>
            <Modal
                open={modalVisibility === AuthModalVisibility.SHOW_LOGIN}
                onClose={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
            >
                <Box className={style.login_box}>
                    <Typography variant="h5" sx={{marginBottom: 3}}>
                        Pinner에 오신것을 환영합니다.
                    </Typography>
                    <Divider sx={{marginBottom: 2}}>아이디 로그인</Divider>
                    <Stack spacing={2} sx={{marginBottom: 5}}>
                        <TextField label="이메일" variant="outlined"
                                   value={email} onChange={onEmailHandler} type="email" placeholder="Email" />
                        <TextField label="비밀번호" variant="outlined"
                                   value={password} onChange={onPasswordHandler} type="password" placeholder="Password"
                                   onKeyDown={(e) => {
                                       if(e.key === "Enter") {
                                           onSubmit();
                                       }
                                   }}/>
                        <Button onClick={onSubmit} variant="contained" type="button" sx={{ backgroundColor: '#33a4ff'}}>
                            로그인
                        </Button>
                        <div style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}>
                            <Button onClick={findNickname}>닉네임 찾기</Button>
                            <Button onClick={findPw}>비밀번호 찾기</Button>
                        </div>
                        {
                            errorMessage && errorAlert(errorMessage)
                        }
                    </Stack>
                    <Divider sx={{marginBottom: 2}}>소셜 계정으로 간편 로그인</Divider>
                    <Stack spacing={2} direction="row" justifyContent="center">
                        <IconButton
                            className={style.login_icon_naver}
                            onClick={() => window.location = "/oauth2/authorization/naver"}
                        >
                            <img src={NaverLoginBtn} alt="NaverLoginBtn" />
                        </IconButton>
                        <IconButton
                            className={style.login_icon_google}
                            onClick={() => window.location = "/oauth2/authorization/google"}
                        >
                            <img src={GoogleLoginBtn} alt="GoogleLoginBtn" />
                        </IconButton>
                    </Stack>
                </Box>
            </Modal>
        </div>
    );
}