import React, {useState} from 'react';

import {Modal, Button, Stack, Box, Typography, TextField} from "@mui/material";
import {Divider} from "@mantine/core";

import {useRecoilState} from 'recoil';
import {postRegister} from '../../apis/auth';

import {AuthModalVisibility, authModalVisibilityState} from '../../states/modal';
import {errorAlert} from "../alert/AlertComponent";


function RegisterModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const [errorMessage, setErrorMessage] = useState('');


    function validInputs() {
        if (!name || name.length < 3) {
            return '닉네임은 3글자 이상 적어주세요.';
        }

        if (!email) {
            return '이메일을 확인해주세요.';
        }

        if (!password || !confirmPassword) {
            return '비밀번호 확인해주세요.';
        }

        if (password !== confirmPassword) {
            return '비밀번호와 비밀번호확인은 같아야 합니다.';
        }
    }

    function clearInputs() {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        // validation
        const errorMessage = validInputs();
        setErrorMessage(errorMessage);
        if (errorMessage) {
            return;
        }

        // prepare data and send request
        const data = JSON.stringify({
            email, password, name
        });

        postRegister(data)
            .then((response) => {
                if (response.status === 201) {
                    alert(response.data.message);

                    setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
                    setErrorMessage("");
                }
            })
            .catch((error) => setErrorMessage(error.response.data ? error.response.data.message : error.message));
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '3px solid #000',
        boxShadow: 48,
        p: 3,
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
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" gutterBottom>
                        회원가입
                    </Typography>
                    <Divider sx={{marginBottom: 20}}/>
                    <Stack spacing={3}>
                        <TextField label="닉네임" variant="outlined"
                                   value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="John Doe"/>
                        <TextField label="이메일" variant="outlined"
                                   value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email" placeholder="example@test.com"/>
                        <TextField label="비밀번호" variant="outlined"
                                   value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password" placeholder="********"/>
                        <TextField label="비밀번호 확인" variant="outlined"
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password" placeholder="********"/>
                        {
                            errorMessage && errorAlert(errorMessage)
                        }
                        <Button onClick={onSubmit} variant="contained">
                            회원가입
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </div>
    );
}

export default RegisterModal;
