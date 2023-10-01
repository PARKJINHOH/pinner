import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

// css
import style from './ProfileModal.module.css';

// component
import {HTTPStatus, useAPIv1} from "../../apis/apiv1";
import {travelerState, useDoLogin} from "../../states/traveler";
import {errorAlert} from "../alert/AlertComponent";
import {AuthModalVisibility, authModalVisibilityState} from '../../states/modal';

// mui
import {Modal, Button, Box, Typography, TextField} from "@mui/material";
import {Divider} from "@mantine/core";

// etc
import {toast} from "react-toastify";


export default function ProfileModal() {
    const apiv1 = useAPIv1();
    const doLogin = useDoLogin();

    const [traveler, setTraveler] = useRecoilState(travelerState);
    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const [signupServices, setSignupServices] = useState(null);

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
        if (!oldPassword) {
            return '현재 비밀번호를 적어주세요.';
        }

        if (name) {
            if (!name || name.length < 2 || name.length > 6) {
                return '닉네임은 2~6자 이내로 적어주세요.';
            } else if (!/^\S+$/.test(name)) {
                return '닉네임은 공백을 사용할 수 없습니다.';
            } else if (!/^[a-zA-Z가-힣0-9]+$/.test(name)) {
                return '닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.';
            }
        }

        if(newPassword){
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
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        // validation
        const errorMessage = validInputs();
        if (errorMessage) {
            setErrorMessage(errorMessage);
            return;
        }

        // 현재 비밀번호 확인
        const nowPasswordData = JSON.stringify({
            email: email,
            password: oldPassword,
        });

        const newVar = await apiv1.post("/traveler/password/check", nowPasswordData)
            .then(response => {
                return response.status;
            })
            .catch(error => {
                if (error.response.status === HTTPStatus.UNAUTHORIZED) {
                    return error.response.status;
                }
            });

        if (newVar !== HTTPStatus.OK) {
            setErrorMessage('현재 비밀번호가 일치하지 않습니다.');
            return;
        } else {
            setErrorMessage('');
        }

        const data = {
            email: email,
            password: oldPassword,
        };
        if (newPassword !== '') {
            data.newPassword = newPassword;
        }
        if (name !== '') {
            data.name = name;
        }
        const newData = JSON.stringify(data);

        await apiv1.put('/traveler', newData)
            .then(response => {
                console.log(response);
                toast.info('수정에 성공했습니다.');
                setModalVisibility(AuthModalVisibility.HIDE_ALL);
                setErrorMessage("");

                doLogin({
                    email: response.data.data.payload.email,
                    name: response.data.data.payload.name,
                    accessToken: response.data.data.payload.accessToken,
                    refreshToken: response.data.data.payload.refreshToken,
                });
            })
            .catch(error => {
                toast.error('수정에 실패했습니다.');
            });
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
                            <Typography sx={{fontSize: '15px'}}>이메일</Typography>
                            <TextField disabled id="outlined-disabled" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email"/>

                            <Typography sx={{fontSize: '15px'}}>닉네임</Typography>
                            <TextField id="outlined" inputProps={{maxLength: 6}} sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="2~6자 이내"/>

                            <Typography sx={{fontSize: '15px'}}>현재 비밀번호 *</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={oldPassword} onChange={(e) => setOldPassword(e.currentTarget.value)} type="password"/>

                            <Typography sx={{fontSize: '15px'}}>신규 비밀번호</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={newPassword} onChange={(e) => setNewPassword(e.currentTarget.value)} type="password" placeholder="최소 8자 이상(대소문자, 숫자, 특수문자 필수)"/>

                            <Typography sx={{fontSize: '15px'}}>신규 비밀번호 확인</Typography>
                            <TextField variant="outlined" sx={{marginBottom: 3, width: '100%'}} size="small"
                                       value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password"/>
                            {
                                errorMessage && errorAlert(errorMessage)
                            }
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