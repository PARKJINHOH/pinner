import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

// css
import style from './ProfileModal.module.css';

// component
import {HTTPStatus, useAPIv1} from "../../apis/apiv1";
import {clearTraveler} from "../../states/webstore";
import {travelerState, useDoLogin} from "../../states/traveler";
import {errorAlert, infoAlert} from "../alert/AlertComponent";
import {AuthModalVisibility, authModalVisibilityState} from '../../states/modal';

// mui
import {Modal, Box, Typography, TextField} from "@mui/material";
import Button from '@mui/joy/Button';
import {Divider} from "@mantine/core";

// etc
import {toast} from "react-toastify";


export default function ProfileModal() {
    const apiv1 = useAPIv1();
    const doLogin = useDoLogin();

    const [traveler, setTraveler] = useRecoilState(travelerState);
    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [signupServices, setSignupServices] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (traveler) {
            setEmail(traveler.email);
            setNickname(traveler.nickname);
            setSignupServices(traveler.signupServices);
        }
    }, [traveler]);

    function validInputs() {
        if (!oldPassword) {
            return '현재 비밀번호를 적어주세요.';
        }

        if (nickname) {
            if (!nickname || nickname.length < 2 || nickname.length > 6) {
                return '닉네임은 2~6자 이내로 적어주세요.';
            } else if (!/^\S+$/.test(nickname)) {
                return '닉네임은 공백을 사용할 수 없습니다.';
            } else if (!/^[a-zA-Z가-힣0-9]+$/.test(nickname)) {
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

    async function deleteTraveler() {
        if (window.confirm('정말 탈퇴하실건가요?')) {
            let resultStatus = await apiv1.post("/traveler/delete", JSON.stringify(traveler))
                .then(response => {
                    alert(response.data.message);
                    return response.status;
                })
                .catch(error => {
                    alert(error.data.message);
                    return error.status;
                });

            if (resultStatus === HTTPStatus.OK) {
                window.location.reload();
                setTraveler(null);
                clearTraveler();
            }
        }
    }

    async function deleteOauthTraveler() {
        if (window.confirm('정말 연동해제(탈퇴)하실건가요?')) {
            let resultStatus = await apiv1.post("/traveler/delete/afteroauth", JSON.stringify(traveler))
                .then(response => {
                    alert(response.data.message);
                    return response.status;
                })
                .catch(error => {
                    alert(error.data.message);
                    return error.status;
                });

            if (resultStatus === HTTPStatus.OK) {
                window.location.reload();
                setTraveler(null);
                clearTraveler();
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
        if (nickname !== '') {
            data.nickname = nickname;
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
                    nickname: response.data.data.payload.nickname,
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
                {
                    signupServices === 'Web' ?
                        /* 홈페이지 가입자 */
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
                                               value={email} type="email"/>

                                    <Typography sx={{fontSize: '15px'}}>닉네임</Typography>
                                    <TextField id="outlined" inputProps={{maxLength: 6}} sx={{marginBottom: 3, width: '100%'}} size="small"
                                               value={nickname} onChange={(e) => setNickname(e.currentTarget.value)} placeholder="2~6자 이내" type="text"/>

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
                                <Button color="danger" variant="solid"
                                        onClick={deleteTraveler}
                                        sx={{width: '60px', marginRight: 'auto'}}
                                >탈퇴</Button>
                                <Button color="primary" variant="solid"
                                        onClick={onSubmit}
                                        sx={{width: '100px', marginLeft: 'auto'}}
                                >저장</Button>
                                <Button color="danger" variant="outlined"
                                        onClick={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
                                        sx={{width: '100px', marginLeft: '10px'}}
                                >취소</Button>
                            </div>
                        </Box>
                        :
                        /* 소셜로그인 가입자 */
                        <Box className={style.profile_box}>

                            <div className={style.title}>
                                <Typography id="modal-modal-title" variant="h5" gutterBottom>
                                    내정보
                                </Typography>

                                <Divider sx={{marginBottom: 10}}/>
                            </div>

                            {
                                infoAlert("SNS가입자는 수정할 수 없습니다.")
                            }

                            <div className={style.content}>
                                <div className={style.myProfile}>
                                    <Typography sx={{fontSize: '15px'}}>이메일</Typography>
                                    <TextField disabled id="outlined-disabled" sx={{marginBottom: 3, width: '100%'}} size="small"
                                               value={email} type="email"/>

                                    <Typography sx={{fontSize: '15px'}}>닉네임</Typography>
                                    <TextField disabled id="outlined-disabled" sx={{marginBottom: 3, width: '100%'}} size="small"
                                               value={nickname} type="text"/>

                                    {
                                        errorMessage && errorAlert(errorMessage)
                                    }
                                </div>
                            </div>

                            <div className={style.save_btn}>
                                <Button color="danger" variant="solid"
                                        onClick={deleteOauthTraveler}
                                        sx={{width: '90px', marginRight: 'auto'}}
                                >연동해제(탈퇴)</Button>
                                <Button color="danger" variant="outlined"
                                        onClick={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
                                        sx={{width: '100px', marginLeft: 'auto'}}
                                >취소</Button>
                            </div>
                        </Box>
                }

            </Modal>
        </div>
    );
}