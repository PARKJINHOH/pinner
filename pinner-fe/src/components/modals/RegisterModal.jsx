import React, {useState} from 'react';
import {useRecoilState} from 'recoil';

// api
import { HTTPStatus, useAPIv1 } from 'apis/apiv1';

// css
import style from './RegisterModal.module.css';

// component
import {postRegister} from 'apis/auth';
import {errorAlert} from "components/alert/AlertComponent";
import {AuthModalVisibility, authModalVisibilityState} from 'states/modal';

// mui
import {Modal, Button, Stack, Box, Typography, TextField, IconButton, Divider} from "@mui/material";


// image
import NaverLoginBtn from "assets/images/login_icon_naver.png";
import GoogleLoginBtn from "assets/images/login_icon_google.png";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {LoadingButton} from "@mui/lab";


export default function RegisterModal() {
    const apiv1 = useAPIv1();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const [errorMessage, setErrorMessage] = useState('');

    const [emailSendLoading, setEmailSendLoading] = useState(false);
    const [emailAuthenticationCode, setEmailAuthenticationCode] = useState('');
    const [isEmailAuthentication, setIsEmailAuthentication] = useState(false);
    const [isFinalEmailAuthentication, setFinalIsEmailAuthentication] = useState(false);


    function validInputs() {
        // if문 순서 중요

        if (!nickname || nickname.length < 2 || nickname.length > 6) {
            return '닉네임은 2~6자 이내로 적어주세요.';
        } else if (!/^\S+$/.test(nickname)) {
            return '닉네임은 공백을 사용할 수 없습니다.';
        } else if (!/^[a-zA-Z가-힣0-9]+$/.test(nickname)) {
            return '닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.';
        }

        if (!email) {
            return '이메일을 확인해주세요.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            return '이메일 형식이 올바르지 않습니다.';
        }

        if (!password || !confirmPassword) {
            return '비밀번호 확인해주세요.';
        } else if (!/\d+/.test(password)) {
            return '비밀번호는 최소 하나 이상의 숫자를 포함해야 합니다.';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            return '비밀번호는 최소 하나 이상의 소문자와 대문자를 포함해야 합니다.';
        } else if (!/[!@#$%^&*()_+~`\-={}[\]:";'<>,.?\\/]+/.test(password)) {
            return '비밀번호는 최소 하나 이상의 특수문자를 포함해야 합니다.';
        } else if (!/.{8,}/.test(password)) {
            return '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (password !== confirmPassword) {
            return '비밀번호와 비밀번호확인은 같아야 합니다.';
        }
    }

    function clearInputs() {
        setEmail('');
        setPassword('');
        setNickname('');
        setConfirmPassword('');
    }

    /**
     * 이메일 인증 발송 여부
     * @returns {Promise<void>}
     */
    async function sendEmail() {
        setEmailSendLoading(true);
        await apiv1.post("/email", JSON.stringify({email: email.trim()}))
            .then((response) => {
                setIsEmailAuthentication(true);
            })
            .catch((error) => {
                console.log(error);
            });
        setEmailSendLoading(false);
    }

    async function getEmailAuthentication() {
        if (emailAuthenticationCode.trim().length === 0) {
            setErrorMessage("이메일 인증 코드를 입력해주세요.");
            return;
        }

        const isEmailAuthCheck = await apiv1.post("email/check", JSON.stringify({email: email.trim(), emailCode : emailAuthenticationCode.trim()}))
            .then((response) => {
                if (response.data === false) {
                    setErrorMessage("이메일 인증 코드를 다시 확인해주세요.");
                } else {
                    setErrorMessage('');
                }
                return response.data; // true, false
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        setFinalIsEmailAuthentication(isEmailAuthCheck);
    }

    const onSubmit = async (event) => {
        if (!isEmailAuthentication) {
            setErrorMessage("이메일 인증을 받아주세요.");
            return;
        }
        event.preventDefault();

        // validation
        const errorMessage = validInputs();
        if (errorMessage) {
            setErrorMessage(errorMessage);
            return;
        }

        // prepare data and send request
        const data = JSON.stringify({
            email, password, nickname, signupServices: "Web"
        });

        postRegister(data)
            .then((response) => {
                if (response.status === HTTPStatus.OK) {
                    alert(response.data);

                    setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
                    setErrorMessage("");
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage(error.response.data ? error.response.data : "장애가 발생했습니다. 다시 시도해 주세요.")
            });
    };
    
    return (
        <div>
            <Modal
                open={modalVisibility === AuthModalVisibility.SHOW_REGISTER}
                onClose={() => {
                    setModalVisibility(AuthModalVisibility.HIDE_ALL);
                    setErrorMessage("");
                    clearInputs();
                }}
            >
                <Box className={style.register_box}>
                    <Typography variant="h5" sx={{marginBottom: 3}}>
                        Pinner에 오신것을 환영합니다.
                    </Typography>
                    <Divider sx={{marginBottom: 2}}>회원가입에 필요한 정보를 입력해주세요</Divider>
                    <Stack spacing={3} sx={{marginBottom: 7}}>
                        <TextField label="닉네임" variant="outlined" inputProps={{maxLength: 6}}
                                   value={nickname} onChange={(e) => setNickname(e.currentTarget.value)} placeholder="2~6자 이내"/>
                        <TextField label="이메일" variant="outlined" disabled={isEmailAuthentication}
                                   value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email" placeholder="example@test.com"
                                   InputProps={{
                                       endAdornment:
                                           <LoadingButton variant="contained" onClick={sendEmail} loading={emailSendLoading} disabled={isEmailAuthentication}>
                                               발송
                                           </LoadingButton>
                                   }}
                        />
                        {
                            isEmailAuthentication &&
                                <>
                                    <TextField label="이메일인증" variant="outlined" disabled={isFinalEmailAuthentication}
                                               value={emailAuthenticationCode} onChange={(e) => setEmailAuthenticationCode(e.currentTarget.value)} type="email"
                                               InputProps={{
                                                   endAdornment:
                                                       <Button variant="contained" onClick={getEmailAuthentication} disabled={isFinalEmailAuthentication} sx={{"&.Mui-disabled": {background: "#eaeaea",color: "#26a400"}}}>
                                                           {isFinalEmailAuthentication ? <CheckCircleOutlineOutlinedIcon /> : '인증'}
                                                       </Button>
                                               }}
                                    />
                                </>
                        }
                        <TextField label="비밀번호" variant="outlined"
                                   value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password" placeholder="최소 8자 이상(대소문자, 숫자, 특수문자 필수)"/>
                        <TextField label="비밀번호 확인" variant="outlined"
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password" placeholder="********"/>
                        {
                            errorMessage && errorAlert(errorMessage)
                        }
                        <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: '#33a4ff'}} disabled={!isFinalEmailAuthentication}>
                            회원가입
                        </Button>
                    </Stack>
                    <Divider sx={{marginBottom: 2}}>소셜 계정으로 간편 회원가입</Divider>
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