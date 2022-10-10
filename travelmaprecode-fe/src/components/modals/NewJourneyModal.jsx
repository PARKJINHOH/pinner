import { Image, SimpleGrid, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React, {useCallback, useEffect, useState} from 'react';
import { Button, Col, Container, Form, Modal, Row, Stack } from 'react-bootstrap';
import PhotoAlbum from 'react-photo-album';
import { useRecoilState, useResetRecoilState } from 'recoil';

import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS

import { useAPIv1 } from '../../apis/apiv1';
import {NewJourneyStep, newJourneyStepState, newLocationState} from '../../states/modal';

import './NewJourneyModal.css'



/**
 * 1. 사진 업로드
 * 2. 데이터 입력
 * 3. POST 요청
 *
 * @param {*} travelId
 * @returns
 */
function NewJourneyModal({ travelId }) {
    // Utils
    /**
     * Date를 yyyy-mm-dd 형태의 문자열로 변환
     *
     * @param {Date} date
     * @returns string
     */
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    const now = formatDate(new Date())


    // 훅 및 상태
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const apiv1 = useAPIv1();

    // 이미지 포스팅
    const [photos, _setPhotos] = useState([]);
    const addPhotos = (newPhotos) => _setPhotos([...photos, ...newPhotos]);
    const removePhoto = (idx) => _setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        async function toPreview(file, index) {
            const tmpPhotoUrl = URL.createObjectURL(file);

            return <div key={tmpPhotoUrl} className="photoContainer">
                <Button variant="danger" size="sm" onClick={() => removePhoto(index)}>삭제</Button>
                <Image src={tmpPhotoUrl} />
            </div>;
        }

        Promise.all(photos.map(toPreview)).then(setPreviews);
    }, [photos]);

    /**
     * @param {File} file
     */
    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("photo", file);

        const resp = await fetch("/photo", {
            method: "POST",
            body: formData,
        });

        return (await resp.json()).link;
    }

    // Journey 데이터
    const [date, setDate] = useState(now);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);
    const resetNewLocationState =  useResetRecoilState(newLocationState);
    const [hashTags, setHashTags] = useState('');



    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    async function onCreate() {
        // 사진 업로드
        const photoIds = await Promise.all(photos.map(uploadImage));
        console.log(hashTags);
        const journeyData = JSON.stringify({
            date,
            newLocation,
            hashTags
        });

        const userEmail = window.sessionStorage.getItem("email");
        await apiv1.post("/travel/" + userEmail + "/journey", journeyData)
            .then((response) => {
                if (response.status === 200) {
                    alert('성공');
                }
            });
    }

    /**
     * 모달 닫을 때 상태 초기화
     */
    function onHideModal() {
        setNewJourneyStep(NewJourneyStep.NONE);

        // 상태 초기화
        resetNewLocationState();
        _setPhotos([]);
    }

    /**
     * HashTag
     */
    const onHashTagChange = useCallback((e) => {
        console.log(e.detail.tagify.value);
        setHashTags(e.detail.tagify.value);
    }, []);

    return (
        <Modal
            show={newJourneyStep === NewJourneyStep.EDITTING}
            onHide={onHideModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">새로운 여행</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={5}>
                        {/* Location Name */}
                        <div>
                            <h3>위치</h3>
                            <Row>
                                <Col xs={10}>
                                    <Form.Control type="text" className='md-3' value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} />
                                </Col>
                                <Col>
                                    <Button onClick={() => setNewJourneyStep(NewJourneyStep.LOCATING)}>위치 선택</Button>
                                </Col>
                            </Row>
                        </div>


                        {/* Date Picker */}
                        <div>
                            <h3>날짜</h3>
                            <input type="date" max={now} value={date} onChange={e => {
                                const dateStr = e.target.value;
                                setDate(dateStr);
                            }} />
                        </div>


                        {/* Photos */}
                        <div>
                            <h3>사진</h3>
                            <PhotoAlbum layout="rows" photos={addPhotos} />
                            <SimpleGrid
                                cols={4}
                                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                            >
                                {[
                                    ...previews,
                                    <Dropzone key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Text>사진 추가</Text>
                                    </Dropzone>
                                ]}
                            </SimpleGrid>
                        </div>


                        {/* Hash tags */}
                        <div>
                            {/*https://github.com/yairEO/tagify*/}
                            <h3>태그</h3>
                            <Tags
                                settings={{
                                    maxTags: '5'
                                }}
                                onChange={onHashTagChange}
                            />
                        </div>
                    </Stack>


                </Modal.Body>
                {/* 저장/취소 */}
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={onHideModal}>취소</Button>
                    <Button variant='primary' onClick={onCreate}>저장</Button>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}

export default NewJourneyModal;
