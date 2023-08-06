import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

// css
import style from './ProfileModal.module.css';

// component
import {postLogin, postRegister} from '../../apis/auth';
import {errorAlert} from "../alert/AlertComponent";
import {AuthModalVisibility, authModalVisibilityState} from '../../states/modal';

// mui
import {Modal, Button, Stack, Box, Typography, TextField} from "@mui/material";

// icon
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

// mantine
import {Divider} from "@mantine/core";
import {HTTPStatus, useAPIv1} from "../../apis/apiv1";
import {travelerState} from "../../states/traveler";
import {toast} from "react-toastify";


export default function ProfileModal() {
    const apiv1 = useAPIv1();

    const [traveler, setTraveler] = useRecoilState(travelerState);
    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);


    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (traveler) {
            setEmail(traveler.email);
            setName(traveler.name);
        }
    }, [traveler]);

    function validInputs() {
        // if문 순서 중요

        if (!name || name.length < 2 || name.length > 6) {
            return '닉네임은 2~6자 이내로 적어주세요.';
        } else if (!/^\S+$/.test(name)) {
            return '닉네임은 공백을 사용할 수 없습니다.';
        } else if (!/^[a-zA-Z가-힣0-9]+$/.test(name)) {
            return '닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.';
        }

        if (!email) {
            return '이메일을 확인해주세요.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            return '이메일 형식이 올바르지 않습니다.';
        }

        if (!newPassword || !confirmPassword) {
            return '비밀번호 확인해주세요.';
        } else if (!/\d+/.test(newPassword)) {
            return '비밀번호는 최소 하나 이상의 숫자를 포함해야 합니다.';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)) {
            return '비밀번호는 최소 하나 이상의 소문자와 대문자를 포함해야 합니다.';
        } else if (!/[!@#$%^&*()_+~`\-={}[\]:";'<>,.?\\/]+/.test(newPassword)) {
            return '비밀번호는 최소 하나 이상의 특수문자를 포함해야 합니다.';
        } else if (!/.{8,}/.test(newPassword)) {
            return '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (newPassword !== confirmPassword) {
            return '비밀번호와 비밀번호확인은 같아야 합니다.';
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        // validation
        // todo
        // const errorMessage = validInputs();
        // if (errorMessage) {
        //     setErrorMessage(errorMessage);
        //     return;
        // }

        // 현재 비밀번호 확인
        const nowPasswordData = JSON.stringify({
            email: email,
            password: oldPassword,
        });


        const newVar = await apiv1.post("/traveler/password/check", nowPasswordData)
            .then(response =>{
                    return response.status;
            })
            .catch(error => {
                if (error.response.status === HTTPStatus.UNAUTHORIZED) {
                    return error.response.status;
                }
            });

        if(newVar !== HTTPStatus.OK){
            setErrorMessage('현재 비밀번호가 일치하지 않습니다.');
            return;
        } else {
            setErrorMessage('');
        }
        // todo

        // prepare data and send request
        const data = JSON.stringify({
            email, password: newPassword, name
        });

        postRegister(data)
            .then((response) => {
                if (response.status === HTTPStatus.CREATED) {
                    alert(response.data.message);

                    setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
                    setErrorMessage("");
                }
            })
            .catch((error) => setErrorMessage(error.response.data ? error.response.data.message : error.message));
    };


    return (
        <div>
            <Modal
                open={modalVisibility === AuthModalVisibility.SHOW_PROFILE}
                onClose={() => {
                    setModalVisibility(AuthModalVisibility.HIDE_ALL);
                }}
            >
                <Box className={style.profile_box}>

                    <div className={style.title}>
                        <Typography id="modal-modal-title" variant="h5" gutterBottom>
                            내정보
                        </Typography>

                        <Divider sx={{marginBottom: 20}}/>
                    </div>

                    <div className={style.content}>
                        <div className={style.myProfile}>
                            <Typography sx={{ fontSize: '15px'}}>이메일</Typography>
                            <TextField disabled id="outlined-disabled" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email"/>

                            <Typography sx={{ fontSize: '15px'}}>닉네임</Typography>
                            <TextField id="outlined" inputProps={{maxLength: 6}} sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="2~6자 이내"/>

                            <Typography sx={{ fontSize: '15px'}}>현재 비밀번호</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={oldPassword} onChange={(e) => setOldPassword(e.currentTarget.value)} type="password" />

                            <Typography sx={{ fontSize: '15px'}}>신규 비밀번호</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={newPassword} onChange={(e) => setNewPassword(e.currentTarget.value)} type="password" placeholder="최소 8자 이상(대소문자, 숫자, 특수문자 필수)"/>

                            <Typography sx={{ fontSize: '15px'}}>신규 비밀번호 확인</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password"/>
                            {
                                errorMessage && errorAlert(errorMessage)
                            }
                        </div>
                        <div className={style.social_group}>
                            <Typography sx={{ fontSize: '25px', fontWeight: 'bold', color: 'Black'}}>
                                소셜계정 연동
                            </Typography>
                            <Typography sx={{ fontSize: '12px', marginBottom: 3 }}>
                                사용하시는 소셜 및 인증 제공자들과 계정을 연동하고 손쉽게 로그인하세요.
                            </Typography>

                            <div className={style.social_btn_group}>
                                {/*연결되어 있으면 연결하기 -> 해제하기*/}
                                <Button variant="outlined" startIcon={<GitHubIcon sx={{marginRight: '5px'}}/>} sx={{width: '200px',marginLeft: 'auto', textTransform: 'none'}}>
                                    Github 연결하기
                                </Button>

                                <Button variant="outlined" startIcon={<GoogleIcon sx={{marginRight: '2px'}}/>} sx={{width: '200px', marginLeft: 'auto', textTransform: 'none'}}>
                                    Google 연결하기
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={style.save_btn}>
                        <Button variant="contained" sx={{width: '100px', marginLeft: 'auto'}} onClick={onSubmit}>
                            저장
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}