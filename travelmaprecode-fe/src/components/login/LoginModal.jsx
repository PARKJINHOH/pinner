import React from 'react';
import {Modal, Button, Form, Container} from "react-bootstrap";

import './LoginModal.css'
import {useState} from "@types/react";
import {sendGetApi, sendPostApi} from "../../api/api";

const LoginModal = ({show, onHide}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (email == null) {
            return alert('이메일 확인해주세요.');
        }

        if (password == null) {
            return alert('비밀번호 확인해주세요.');
        }

        let data = JSON.stringify({
                email: email,
                password: password
            }
        );
        await sendPostApi('/api/v1/login', data);

    }


    return (
        <Modal
            show={show}
            onHide={onHide}
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
                            <Form.Control value={email} onChange={onEmailHandler} type="email" placeholder="Email"/>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control value={password} onChange={onPasswordHandler} type="password" placeholder="Password"/>
                        </Form.Group>
                        <br/>
                        <Button onClick={onSubmit} variant="info" type="button" className="my-3">
                            로그인
                        </Button>
                    </Form>
                </Modal.Body>
            </Container>
        </Modal>
    );
};

export default LoginModal;