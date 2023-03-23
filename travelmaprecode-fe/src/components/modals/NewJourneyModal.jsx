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
import { Paper, Box, ImageList, ImageListItem, InputAdornment, OutlinedInput } from "@mui/material";
import Button from '@mui/joy/Button';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Input from '@mui/joy/Input';
import { Add, Place, Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { pink } from "@mui/material/colors";

/*ETC Import*/
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Tags from "@yaireo/tagify/dist/react.tagify"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css";


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

    // 이미지 포스팅
    const [photos, _setPhotos] = useState([]);
    const addPhotos = (newPhotos) => _setPhotos([...photos, ...newPhotos]);
    const removePhoto = (idx) => _setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    const [previews, setPreviews] = useState([]);

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

    const paperStyle = {
        position: 'fixed',
        top: 'auto',
        right: '5px',
        bottom: '5px',
        transform: 'translate(-0%, -0%)',
        width: 'calc(100vw - 290px)', // viewport 가로축 크기 - 40px (padding)
        height: '320px',
        padding: '0px',
        zIndex: 9999, // 우선순위 (높을수록 최상단)
    };

    const boxStyle1 = {
        borderRight: '1px dashed grey',
        height: '320px',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const boxStyle2 = {
        borderRight: '1px dashed grey',
        height: '320px',
        paddingTop: '20px',
    };

    const boxStyle3 = {
        height: '320px',
        width: '95%',
        paddingTop: '20px',
    };


    return (
        <div>
            {newJourneyStep === NewJourneyStep.EDITTING && (
                <Paper sx={paperStyle}>
                    <IconButton
                        onClick={onHideModal} sx={{ p: 1 }}
                        style={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            <Grid xs={2}>
                                <Box sx={boxStyle1}>
                                    <div>
                                        {[
                                            <Dropzone key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                사진 추가
                                            </Dropzone>
                                        ]}
                                    </div>
                                    <div>
                                        <Button variant="outlined" onClick={onHideModal}>취소</Button>
                                        <Button variant="outlined" onClick={onCreate}>저장</Button>
                                    </div>
                                </Box>
                            </Grid>
                            <Grid xs={4}>
                                <Box sx={boxStyle2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["DatePicker"]}>
                                            <DesktopDatePicker
                                                label="언제 여행하셨나요?"
                                                value={date}
                                                format={"YYYY/MM/DD"}
                                                onChange={(newValue) => { setDate(newValue) }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                    <br />

                                    <OutlinedInput
                                        sx={{ width: '90%' }}
                                        placeholder="어디를 여행하셨나요?"
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

                                    <br />

                                    <h5>태그</h5>
                                    <Tags
                                        settings={{ maxTags: '5' }}
                                        onChange={onHashTagChange}
                                        placeholder='최대 5개'
                                    />
                                </Box>
                            </Grid>
                            <Grid xs>
                                <Box sx={boxStyle3}>
                                    <ImageList sx={{ height: 300 }} variant="masonry" cols={3}>
                                        {[...previews]}
                                    </ImageList>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            )}
        </div>
    );
}

export default NewJourneyModal;
