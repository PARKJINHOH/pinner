import React, {useState} from 'react';
import {Modal, Button, Form, Container, Stack} from "react-bootstrap";
import {sendPostApi} from '../../apis/api';
import {useRecoilState} from "recoil";
import {registerStatus} from "../../_states/register";
import {loginStatus} from "../../_states/login";

const RegisterModal = ({show, onHide}) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [registerModalOn, setRegisterModalOn] = useRecoilState(registerStatus);
    const [LoginModalOn, setLoginModalOn] = useRecoilState(loginStatus);

    const onNicknameHandler = (event) => {
        setNickname(event.currentTarget.value);
    }
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if (nickname == null || nickname.length < 3) {
            return alert('닉네임은 3글자 이상 적어주세요.');
        }

        if (email == null) {
            return alert('이메일 확인해주세요.');
        }

        if (password == null) {
            return alert('비밀번호 확인해주세요.');
        }

        if (confirmPassword == null) {
            return alert('비밀번호 확인해주세요.');
        }

        if (password !== confirmPassword) {
            return alert('비밀번호와 비밀번호확인은 같아야 합니다.');
        }

        const data = JSON.stringify({
            email: email, password: password
        });

        sendPostApi('/api/traveler/register', data)
            .then(response => {
                if (response.status === 201) {
                    alert(response.data.message);
                    setRegisterModalOn(false);
                    setLoginModalOn(true);
                }
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    }

    return (<Modal
        show={show}
        onHide={onHide}
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
                        <Form.Control value={nickname} onChange={onNicknameHandler} placeholder="Nickname"/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>이메일</Form.Label>
                        <Form.Control value={email} onChange={onEmailHandler} type="email" placeholder="Email"/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control value={password} onChange={onPasswordHandler} type="password" placeholder="Password"/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>비밀번호 확인</Form.Label>
                        <Form.Control value={confirmPassword} onChange={onConfirmPasswordHandler} type="password" placeholder="Confirm Password"/>
                    </Form.Group>
                    <br/>
                    <Button onClick={onSubmit} variant="info" type="button" className="my-3">
                        회원가입
                    </Button>
                    <Stack>
                        <a href="/oauth2/authorization/github">
                            <Button block="true" variant="info" type="button" className="my-3">
                                GitHub으로 시작하기
                            </Button>
                        </a>
                        {/* TODO: 후에 추가 될 수도 있음 */}
                    </Stack>
                </Form>
            </Modal.Body>
        </Container>
    </Modal>);
};

export default RegisterModal;