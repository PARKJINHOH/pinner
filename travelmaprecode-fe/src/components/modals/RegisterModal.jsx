import React, { useState } from 'react';
import { Alert, Button, Container, Form, Modal, Stack } from 'react-bootstrap';

import { useRecoilState } from 'recoil';
import { postRegister } from '../../apis/auth';

import { AuthModalVisibility, authModalVisibilityState } from '../../states/modal';

function RegisterModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const [errorMessage, setErrorMessage] = useState("");


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

    return (
        <Modal
            show={modalVisibility === AuthModalVisibility.SHOW_REGISTER}
            onHide={() => {
                setModalVisibility(AuthModalVisibility.HIDE_ALL);
                setErrorMessage("");
                clearInputs();
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">회원가입</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Stack className='gap-3'>
                            <Form.Group>
                                <Form.Label>닉네임</Form.Label>
                                <Form.Control value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="John Doe" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>이메일</Form.Label>
                                <Form.Control value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email" placeholder="example@test.com" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password" placeholder="********" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password" placeholder="********" />
                            </Form.Group>

                            {
                                errorMessage && <Alert variant='danger'> {errorMessage} </Alert>
                            }

                            <Button onClick={onSubmit} type="button" className="mb-3">
                                회원가입
                            </Button>
                        </Stack>

                    </Form>

                </Modal.Body>
            </Container>
        </Modal>
    );
}

export default RegisterModal;
