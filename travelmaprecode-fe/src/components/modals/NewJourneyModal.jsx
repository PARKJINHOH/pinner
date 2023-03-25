/*React Import*/
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState, newLocationState } from '../../states/modal';
import { travelState } from "../../states/travel";
import './NewJourneyModal.css';
import { toast } from 'react-hot-toast';

/*API Import*/
import { useAPIv1 } from '../../apis/apiv1';

/*MUI Import*/
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Box, ImageListItem, InputAdornment, OutlinedInput, Typography, createTheme, ThemeProvider, imageListItemClasses } from "@mui/material";
import Button from '@mui/joy/Button';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { Place } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { pink } from "@mui/material/colors";

/*ETC Import*/
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Tags from "@yaireo/tagify/dist/react.tagify"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css";


const theme = createTheme({
    breakpoints: {
        values: {
            mobile: 0,
            bigMobile: 350,
            tablet: 650,
            desktop: 900,
            desktop4k: 2000,
        },
    },
});

const bpGridTemplateColumns = {
    mobile: "repeat(2, 1fr)",
    bigMobile: "repeat(3, 1fr)",
    tablet: "repeat(4, 1fr)",
    desktop: "repeat(7, 1fr)",
    desktop4k: "repeat(10, 1fr)",
};

/**
 * 1. 사진 업로드
 * 2. 데이터 입력
 * 3. POST 요청
 *
 * @param {*} travelId
 * @returns
 */
function NewJourneyModal({ travelId }) {

    // 훅 및 상태
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const apiv1 = useAPIv1();

    const removePhoto = (idx) => _setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    const [previews, setPreviews] = useState([]);

    // 이미지 포스팅
    const [photos, _setPhotos] = useState([]);

    const addPhotos = (newPhotos) => {
        let limitPhoto = 8; // 최대 사진 갯수

        const currentPhotoCount = photos.length;
        const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
        const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
        const combinedPhotos = [...photos, ...additionalPhotos];

        _setPhotos(combinedPhotos);
    };


    useEffect(() => {
        async function toPreview(file, index) {
            const tmpPhotoUrl = URL.createObjectURL(file);

            return (
                <ImageListItem key={tmpPhotoUrl}>
                    <IconButton
                        onClick={() => removePhoto(index)}
                        sx={{ p: 1 }}
                        style={{ position: 'absolute', top: 0, left: 0 }}>
                        <HighlightOffIcon
                            sx={{ color: pink[500] }}
                        />
                    </IconButton>
                    <img
                        src={tmpPhotoUrl}
                        srcSet={tmpPhotoUrl}
                        loading="lazy"
                        alt="tmpImg" />
                </ImageListItem>
            );
        }

        Promise.all(photos.map(toPreview)).then(setPreviews);
    }, [photos]);

    /**
     * @param {File} file
     * @returns {String}
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
    const [date, setDate] = useState(dayjs(new Date()));
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);
    const resetNewLocationState = useResetRecoilState(newLocationState);
    const [hashTags, setHashTags] = useState([]);
    const setTravels = useSetRecoilState(travelState);

    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    const onCreate = async (event) => {
        event.preventDefault();

        // 사진 업로드
        let photoIds = [];
        try {
            photoIds = await Promise.all(photos.map(uploadImage));
        } catch (err) {
            console.error(`failed to upload photos: ${err}`);
            toast.error("사진을 업로드 하지 못했어요.")
            return;
        }

        // Journey 생성
        const journeyData = JSON.stringify({
            date: dayjs(date).format('YYYY-MM-DD'),
            geoLocation: newLocation,
            photos: photoIds,
            hashTags: hashTags
        });

        await apiv1.post("/travel/" + travelId + "/journey", journeyData)
            .then((response) => {
                if (response.status === 200) {
                    setTravels(response.data);
                    onHideModal();
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
        let map = e.detail.tagify.value.map(e =>
            e.value
        );
        setHashTags(map);
    }, []);

    const containerHeight = '360px';

    const paperStyle = {
        position: 'fixed',
        top: 'auto',
        right: '5px',
        bottom: '5px',
        transform: 'translate(-0%, -0%)',
        width: 'calc(100vw - 290px)', // viewport 가로축 크기 - 40px (padding)
        height: containerHeight,
        borderRadius: '16px',
        padding: '0px',
        zIndex: 9999, // 우선순위 (높을수록 최상단)
    };

    const boxStyle1 = {
        borderRight: '1px dashed grey',
        height: containerHeight,
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const boxStyle2 = {
        borderRight: '1px dashed grey',
        height: containerHeight,
        paddingTop: '20px',
    };

    const boxStyle3 = {
        height: containerHeight,
        width: '95%',
        paddingTop: '20px',
    };


    return (
        <div>
            {newJourneyStep === NewJourneyStep.EDITTING && (
                <Paper sx={paperStyle} elevation={4}>
                    <Box sx={{ padding: 3 }} >
                        <Grid container spacing={3}>
                            <Box xs={4}>
                                <Typography variant='h6' >언제 여행하셨나요?</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        className='datepicker'
                                        value={date}
                                        format={"YYYY/MM/DD"}
                                        onChange={(newValue) => { setDate(newValue) }}
                                    />
                                </LocalizationProvider>

                                <Box mb={3} />

                                <Typography variant='h6' >어디를 여행하셨나요?</Typography>
                                <OutlinedInput
                                    size="small"
                                    sx={{ width: '90%' }}
                                    placeholder="장소이름"
                                    variant="outlined"
                                    value={newLocation.name}
                                    onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setNewJourneyStep(NewJourneyStep.LOCATING)}
                                                edge="end"
                                            >
                                                <Place />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />

                                <Box mb={3} />

                                <h5>태그</h5>
                                <Tags
                                    settings={{ maxTags: '5' }}
                                    onChange={onHashTagChange}
                                    placeholder='최대 5개'
                                />

                                <Box mb={3} />

                                {/* 확인/취소 버튼 */}
                                <>
                                    <Button variant="outlined" color='danger' onClick={onHideModal}>취소</Button>
                                    <Box display='inline-block' sx={{ mx: 'auto', width: 10, height: 10 }} />
                                    <Button variant="outlined" onClick={onCreate}>저장</Button>
                                </>
                            </Box>

                            {/* 사진 미리보기 */}
                            <Grid xs={1} flexGrow={1}>
                                <ThemeProvider theme={theme}>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: bpGridTemplateColumns,
                                            [`& .${imageListItemClasses.root}`]: {
                                                display: "flex",
                                                flexDirection: "column"
                                            }
                                        }}
                                    >
                                        {[

                                            <Dropzone key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                사진 추가
                                            </Dropzone>,
                                            ...previews,
                                        ]}
                                    </Box>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            )
            }
        </div >
    );
}

export default NewJourneyModal;
