import { Image, SimpleGrid, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, Stack } from 'react-bootstrap';
import PhotoAlbum from 'react-photo-album';

import { useAPIv1 } from '../../apis/apiv1';





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

    const apiv1 = useAPIv1();

    // 이미지 포스팅
    const [images, _setImages] = useState([]);
    const addImages = (imgs) => _setImages([...images, ...imgs]);
    const removeImages = (idx) => _setImages([...images.slice(0, idx), ...images.slice(idx + 1, images.length)]);

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        async function imageToPreview(file, index) {
            const imageUrl = URL.createObjectURL(file);
            const hoverBtnStyle = {
                position: "relative",
                top: -40,
                left: 10,
            };

            return <div key={imageUrl}>
                <Image src={imageUrl} />
                <Button style={hoverBtnStyle} variant="danger" size="sm" onClick={() => removeImages(index)}>삭제</Button>
            </div>;
        }

        Promise.all(images.map(imageToPreview)).then(setPreviews);
    }, [images]);

    /**
     * @param {File} file
     */
    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        const resp = await fetch("/images", {
            method: "POST",
            body: formData,
        });

        return (await resp.json()).link;
    }

    // Journey 데이터
    const [date, setDate] = useState(now);



    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    async function onCreate() {
        // 사진 업로드
        const photoIds = await Promise.all(images.map(uploadImage));

        // FIXME: 데이터 맞게 변환
        // await apiv1.post(`/travel/${travelId}/journey`, journeyData);
        // journeyData
    }

    return (
        <Modal
            show={true}
            onHide={() => { }}
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
                        <div></div>


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
                            <PhotoAlbum layout="rows" photos={addImages} />
                            <SimpleGrid
                                cols={4}
                                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                mt={previews.length > 0 ? 'xl' : 0}
                            >
                                {[
                                    ...previews,
                                    <Dropzone key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addImages}>
                                        <Text align="center">Drop images here</Text>
                                    </Dropzone>
                                ]}
                            </SimpleGrid>
                        </div>


                        {/* Hash tags */}
                        <div>
                            <h3>태그</h3>

                        </div>
                    </Stack>


                </Modal.Body>
                {/* 저장/취소 */}
                <Modal.Footer>
                    <Button variant='outline-primary'>취소</Button>
                    <Button variant='primary' onClick={onCreate}>저장</Button>
                </Modal.Footer>
            </Container>
        </Modal>
    );
}

export default NewJourneyModal;
