import { Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React from 'react';
import { useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import PhotoAlbum from 'react-photo-album';

import { atom, useRecoilState } from 'recoil';
import { useAPIv1 } from '../../apis/apiv1';


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

const newJourneyData = atom({
    key: "newJourneyData",
    default: {
        date: now,
        visible: false,
        "geo-data": {
            lat: 0,
            lng: 0,
        },
        photos: [],
        hashtags: [],
    },
});

function useNewJourneyData() {
    const [journeyData, setJourneyData] = useRecoilState(newJourneyData);


    return {
        setDate: (dateStr) => {
            setJourneyData({
                ...journeyData,
                date: dateStr,
            });
        },
    };
}

function asyncImageLoad(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

/**
 * 1. 사진 업로드
 * 2. 데이터 입력
 * 3. POST 요청
 *
 * @param {*} travelId 
 * @returns 
 */
function NewJourneyModal({ travelId }) {
    const apiv1 = useAPIv1();
    const [files, setFiles] = useState([]);
    const useJourneyData = useNewJourneyData();

    const previews =  files.map(async (file, index) => {
        console.log(file);
        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);

        const image = await asyncImageLoad(imageUrl);
        console.log(image.width, image.height);

        return (
            {
                src: imageUrl,
                width: image.width,
                height: image.height,
            }
        );
    });

    const [journeyData, setJourneyData] = useRecoilState(newJourneyData);

    /**
     * @param {File} file
     */
    async function upload(file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const resp = (await fetch("/images", {
                method: "post",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }));

            const imageId = resp.links;
            return imageId;
        } catch (error) {
            alert(error);
        }
    }

    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     * 3. 
     */
    async function onNewJourney() {
        // FIXME: 데이터 맞게 변환
        await apiv1.post(`/travel/${travelId}/journey`, journeyData);
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
                    {/* Location Name */}

                    {/* Date Picker */}
                    <h3>날짜</h3>
                    <input type="date" max={now} value={journeyData.date} onChange={e => {
                        const dateStr = e.target.value;
                        useJourneyData.setDate(dateStr);
                    }} />

                    {/* Photos */}
                    <h3>사진</h3>
                    <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                        <Text align="center">Drop images here</Text>
                    </Dropzone>
                    <PhotoAlbum layout="rows" photos={previews} />
                    {/* <SimpleGrid
                        cols={5}
                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                        mt={previews.length > 0 ? 'xl' : 0}
                    >
                        {previews}
                    </SimpleGrid> */}

                    {/* Hash tags */}
                    <h3>태그</h3>

                    {/* 저장/취소 */}
                </Modal.Body>
            </Container>
        </Modal>
    );
}

export default NewJourneyModal;
