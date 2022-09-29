import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { postLogin } from '../../apis/auth';
import { AuthModalVisibility, authModalVisibilityState } from '../../states/modal';

import { useDoLogin } from '../../states/traveler';

function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    const doLogin = useDoLogin();

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (email == null) {
            alert('이메일 확인해주세요.');
        }

        if (password == null) {
            alert('비밀번호 확인해주세요.');
        }

        const data = JSON.stringify({
            email, password,
        });

        postLogin(data)
            .then((response) => {
                const payload = response.data.data.payload;
                console.log({ payload });

                doLogin({
                    email: payload.email,
                    accessToken: payload.accessToken,
                    refreshToken: payload.refreshToken,
                });

                // 로그인 모달 감춤
                setModalVisibility(AuthModalVisibility.HIDE_ALL);
            })
            .catch((error) => {
                console.log(error)
                alert(error.response.data.message);
            });
    };

    return (
        <Modal
            show={modalVisibility === AuthModalVisibility.SHOW_LOGIN}
            onHide={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">로그인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>이메일</Form.Label>
                            <Form.Control value={email} onChange={onEmailHandler} type="email" placeholder="Email" />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control value={password} onChange={onPasswordHandler} type="password" placeholder="Password" />
                        </Form.Group>
                        <br />
                        <Button onClick={onSubmit} variant="info" type="button" className="my-3">
                            로그인
                        </Button>
                    </Form>
                </Modal.Body>
            </Container>
        </Modal>
    );
}

export default LoginModal;
