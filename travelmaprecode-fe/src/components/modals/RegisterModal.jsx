import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';

import { useRecoilState } from 'recoil';
import { postRegister } from '../../apis/auth';

import { ModalVisibility, modalVisibilityState } from '../../states/modal';

function RegisterModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modalVisibility, setModalVisibility] = useRecoilState(modalVisibilityState);

    const onNicknameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (name == null || name.length < 3) {
            alert('닉네임은 3글자 이상 적어주세요.');
        }

        if (email == null) {
            alert('이메일 확인해주세요.');
        }

        if (password == null) {
            alert('비밀번호 확인해주세요.');
        }

        if (confirmPassword == null) {
            alert('비밀번호 확인해주세요.');
        }

        if (password !== confirmPassword) {
            alert('비밀번호와 비밀번호확인은 같아야 합니다.');
        }

        const data = JSON.stringify({
            email, password, name
        });

        postRegister(data)
            .then((response) => {
                if (response.status === 201) {
                    alert(response.data.message);

                    setModalVisibility(ModalVisibility.SHOW_LOGIN);
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    };

    const willShow = modalVisibility === ModalVisibility.SHOW_REGISTER;

    return (
        <Modal
            show={willShow}
            onHide={() => setModalVisibility(ModalVisibility.HIDE_ALL)}
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
                        <Form.Group>
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control value={name} onChange={onNicknameHandler} placeholder="Nickname" />
                        </Form.Group>
                        <br />
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
                        <Form.Group>
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control value={confirmPassword} onChange={onConfirmPasswordHandler} type="password" placeholder="Confirm Password" />
                        </Form.Group>
                        <br />
                        <Button onClick={onSubmit} variant="info" type="button" className="my-3">
                            회원가입
                        </Button>
                    </Form>
                </Modal.Body>
            </Container>
        </Modal>
    );
}

export default RegisterModal;
