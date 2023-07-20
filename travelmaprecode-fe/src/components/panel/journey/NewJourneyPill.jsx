import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";

// api
import {useAPIv1} from '../../../apis/apiv1'

// css
import style from './NewJourneyPill.module.css';

// component
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../../states/panel/panelWidth";
import {travelState} from "../../../states/travel";
import {NewJourneyStep, newJourneyStepState, newLocationState} from "../../../states/modal";

// mui
import {Box, Button, ImageList, ImageListItem, ImageListItemBar, Input, Paper, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";

// mui Icon
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// mantine
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";

// etc
import Tags from "@yaireo/tagify/dist/react.tagify";
import dayjs from "dayjs";
import {toast} from "react-hot-toast";


/**
 * Journey 글쓰기 컴포넌트
 * @param travel
 */
export default function NewJourneyPill({ travel, editingCancel }) {
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const _setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    const currentDate = dayjs().format('YYYY-MM-DD');
    const [pickerDate, setPickerDate] = useState(dayjs(currentDate));
    const [hashtags, setHashtags] = useState([])
    const [photos, _setPhotos] = useState([]);

    const removePhoto = (idx) => _setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    useEffect(() => {
        setNewLocation({lat: 0, lng: 0, name: "",});
    }, [])

    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    const onCreate = async () => {

        if(newLocation.name === "") {
            toast.error("여행한 지역을 선택해주세요.");
            return;
        }
        if(hashtags.length === 0) {
            toast.error("여행을 대표하는 태그를 1개 이상 입력해주세요.");
            return;
        }


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
            date: dayjs(pickerDate).format('YYYY-MM-DD'),
            geoLocation: newLocation,
            photos: photoIds,
            hashtags: hashtags
        });

        await apiv1.post("/travel/" + travel.id + "/journey", journeyData)
            .then((response) => {
                if (response.status === 200) {
                    _setTravels(response.data);
                    editingCancel();
                }
            });
    }

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

    /**
     * HashTag
     */
    const onHashTagChange = useCallback((e) => {
        let map = e.detail.tagify.value.map(e =>
            e.value
        );
        setHashtags(map);
    }, []);

    const addPhotos = (newPhotos) => {
        let limitPhoto = 10; // 최대 사진 갯수

        const currentPhotoCount = photos.length;
        const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
        const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
        const combinedPhotos = [...photos, ...additionalPhotos];
        _setPhotos(combinedPhotos);
    };

    /**
     * DatePicker용 Button 함수
     * @param props
     * @returns {JSX.Element}
     * @constructor
     */
    function ButtonField(props) {
        const {
            setOpen,
            label,
            id,
            disabled,
            InputProps: { ref } = {},
            inputProps: { 'aria-label': ariaLabel } = {},
        } = props;

        return (
            <Button
                variant="text"
                size="small"
                id={id}
                disabled={disabled}
                ref={ref}
                aria-label={ariaLabel}
                onClick={() => setOpen?.((prev) => !prev)}
            >
                {label}
            </Button>
        );
    }

    /**
     * 클릭시 DatePicker 관련 함수
     * @param props
     * @returns {JSX.Element}
     * @constructor
     */
    function ButtonDatePicker(props) {
        const [open, setOpen] = useState(false);

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slots={{ field: ButtonField, ...props.slots }}
                    slotProps={{ field: { setOpen } }}
                    {...props}
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                />
            </LocalizationProvider>
        );
    }

    return (
        <>
            <Paper
                className={style.root_paper}
                sx={{width: _journeyPanelWidth, left: _sidebarWidth + _travelListViewWidth,}}
            >
                <Box className={style.newJourney_box}>
                    <div className={style.newJourney_arrowBack}>
                        <ArrowBackIosIcon
                            sx={{marginLeft: 2}}
                            onClick={() => {
                                editingCancel();
                            }}
                        />
                        <Input
                            className={style.newJourney_title}
                            placeholder="여행한 장소를 입력해주세요."
                            inputProps={{maxLength: 50}}
                            value={newLocation.name}
                            onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                        />
                        <LocationOnIcon
                            className={style.newJourney_location}
                            onClick={() => {
                                toast('지도를 클릭해주세요', {duration: 2000,});
                                setNewJourneyStep(NewJourneyStep.LOCATING);
                            }}
                        />
                    </div>
                    <div className={style.newJourney_date}>
                        <ButtonDatePicker
                            label={`${pickerDate.format('YYYY-MM-DD')}`}
                            value={pickerDate}
                            onChange={(newPickerDate) => setPickerDate(newPickerDate)}
                        />
                    </div>
                    <div>
                        <Tags
                            className={style.newJourney_tags}
                            settings={{maxTags: '5'}}
                            onChange={onHashTagChange}
                            placeholder='태그 최대 5개'
                        />
                    </div>
                </Box>
                <Box className={style.newJourney_imageBox}>
                    <ImageList variant="masonry" cols={2} gap={8}>
                        {photos.map((file, index) => {
                            const tmpPhotoUrl = URL.createObjectURL(file);
                            return (
                                <ImageListItem key={index}>
                                    <ImageListItemBar
                                        sx={{
                                            background: "transparent"
                                        }}
                                        position="top"
                                        actionPosition="right"
                                        actionIcon={
                                            <IconButton onClick={() => removePhoto(index)}>
                                                <DeleteForeverIcon fontSize="small"/>
                                            </IconButton>
                                        }
                                    />
                                    <img
                                        src={tmpPhotoUrl}
                                        srcSet={tmpPhotoUrl}
                                        loading="lazy"
                                        alt="tmpImg"
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                    <Dropzone className={style.newJourney_add_picture}
                              key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos}>
                        <Typography variant="p" align="center" color="textSecondary">
                            클릭 혹은 <br/>
                            드래그 앤 드랍으로 <br/>
                            사진 추가
                        </Typography>
                    </Dropzone>
                </Box>
                <button onClick={onCreate}>Save
                </button>
            </Paper>
        </>
    );
}