import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";

// api
import {useAPIv1} from '../../../apis/apiv1'

// css
import style from './JourneyView.module.css';

// component
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../../states/panel/panelWidth";
import {travelState} from "../../../states/travel";
import {NewJourneyStep, newJourneyStepState, newLocationState} from "../../../states/modal";

// mui
import {Box, Button, ImageList, ImageListItem, ImageListItemBar, Input, Paper, Typography, IconButton} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

// mui Icon
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// mantine
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";

// etc
import dayjs from "dayjs";
import Tags from "@yaireo/tagify/dist/react.tagify";
import toast from "react-hot-toast";

/**
 * Journey 보기 및 수정
 * @param travel
 */
export default function JourneyView({travelId, journey, viewCancel}) {
    const apiv1 = useAPIv1();

    const [editMode, setEditMode] = useState(false);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const _setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    const [pickerDate, setPickerDate] = useState(null);
    const [hashtags, setHashtags] = useState([])
    const [photos, setPhotos] = useState([]);
    const removePhoto = (idx) => setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    useEffect(() => {
        setNewLocation({lat: 0, lng: 0, name: "",});
        setHashtags(journey.hashtags);

        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;
        setPhotos([]);
        journey.photos.map((photoName) => {
            const imageUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}/photo/${photoName}`;

            // 이미지 URL을 Blob 객체로 가져오기
            fetch(imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    // const objectUrl = URL.createObjectURL(blob);
                    setPhotos((prevPhotos) => [...prevPhotos, blob]);
                })
                .catch((error) => {
                    console.error('Failed to image:', error);
                });
        });

        return () => {
            photos.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [])

    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    const onCreate = async () => {
        if (!newLocation.name && !journey.geoLocationDto) {
            toast.error("여행한 지역을 선택해주세요.");
            return;
        }
        if(hashtags.length === 0) {
            toast.error("여행을 대표하는 태그를 1개 이상 입력해주세요.");
            return;
        }

        let photoIds = [];
        if(photos.length !== 0){
            try {
                photoIds = await Promise.all(photos.map(uploadImage));
            } catch (err) {
                console.error(`failed to upload photos: ${err}`);
                toast.error("사진을 업로드 하지 못했어요.")
                return;
            }
        }


        const journeyData = {};
        if (newLocation.name !== "") {
            journeyData.geoLocation = newLocation;
        }
        if (pickerDate) {
            journeyData.date = dayjs(pickerDate).format('YYYY-MM-DD');
        }
        if (hashtags.length !== 0) {
            journeyData.hashtags = hashtags;
        }
        if (photos) {
            // Todo : 지금은 항상 True
            journeyData.photos = photoIds;
        }

        if (JSON.stringify(journeyData) !== '{}') {
            await apiv1.put(`/travel/${travelId}/journey/${journey.id}`, JSON.stringify(journeyData))
                .then((response) => {
                    if (response.status === 200) {
                        // 화면이 꺼짐
                        _setTravels(response.data);
                        setEditMode(!editMode);
                    }
                });
        }

    }


    const addPhotos = (newPhotos) => {
        let limitPhoto = 8; // 최대 사진 갯수

        const currentPhotoCount = photos.length;
        const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
        const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
        const combinedPhotos = [...photos, ...additionalPhotos];
        setPhotos(combinedPhotos);
    };

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
            <Paper sx={{
                padding: 2,
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box>
                    <div className={style.journeyView_title_group}>
                        <ArrowBackIosIcon
                            sx={{cursor: 'pointer'}}
                            onClick={() => {
                                viewCancel();
                            }}
                        />
                        {
                            editMode ?
                                <>
                                    <Input
                                        className={style.journeyView_title}
                                        placeholder="여행한 장소를 입력해주세요."
                                        inputProps={{maxLength: 50}}
                                        value={newLocation.name != "" ? newLocation.name : journey.geoLocationDto.name}
                                        onChange={e => setNewLocation({...journey.geoLocationDto, name: e.target.value})}
                                    />
                                    <LocationOnIcon
                                        sx={{cursor: 'pointer'}}
                                        className={style.journeyView_location}
                                        onClick={() => {
                                            toast('지도를 클릭해주세요', {duration: 2000,});
                                            setNewJourneyStep(NewJourneyStep.LOCATING);
                                        }}
                                    />
                                </>
                                :
                                <Typography variant="h6" className={style.journeyView_title}>
                                    {journey.geoLocationDto.name}
                                </Typography>
                        }
                    </div>
                    <div className={style.journeyView_date}>
                        {
                            editMode ?
                                <>
                                    <ButtonDatePicker
                                        label={pickerDate ? `${pickerDate.format('YYYY-MM-DD')}` : dayjs(journey.date).format('YYYY-MM-DD')}
                                        value={dayjs(journey.date)}
                                        onChange={(newPickerDate) => setPickerDate(newPickerDate)}
                                    />
                                </>
                                :
                                <>
                                    <Typography>
                                        {dayjs(journey.date).format("YYYY.MM.DD")}
                                    </Typography>
                                </>
                        }

                    </div>
                    <div className={style.journeyView_tag_div}>
                        {
                            editMode ?
                            <>
                                <Tags
                                    className={style.journeyView_tags}
                                    settings={{maxTags: '5'}}
                                    onChange={onHashTagChange}
                                    placeholder='태그 최대 5개'
                                    defaultValue={hashtags.length != 0 ? hashtags : journey.hashtags}
                                />
                            </>
                            :
                            <>
                                {
                                    journey.hashtags.map((tag, index) => (
                                            <div key={index} className={style.journeyView_tag}>{tag}</div>
                                        )
                                    )
                                }
                            </>
                        }
                    </div>
                </Box>
                <Box className={style.journeyView_edit}>
                    {
                        editMode ?
                            <>
                                <CheckCircleOutlineIcon
                                    sx={{cursor: 'pointer'}}
                                    onClick={() => {
                                        if (!onCreate()) {
                                            setEditMode(!editMode);
                                        }

                                    }}
                                />
                                <CancelIcon
                                    sx={{cursor: 'pointer'}}
                                    onClick={() => {
                                        setEditMode(!editMode);
                                    }}
                                />
                            </>
                            :
                            <ModeEditIcon
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    setEditMode(!editMode);
                                }}
                            />
                    }

                </Box>
                <Box className={style.journeyView_imageBox}>
                    {
                        editMode ?
                            <>
                                <ImageList variant="masonry" cols={2} gap={8}>
                                    {
                                        photos && photos.map((file, index) => {
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
                                        })
                                    }
                                </ImageList>
                                <Dropzone className={style.journeyView_add_picture}
                                          key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos}>
                                    <Typography variant="p" align="center" color="textSecondary">
                                        클릭 혹은 <br/>
                                        드래그 앤 드랍으로 <br/>
                                        사진 추가
                                    </Typography>
                                </Dropzone>
                            </>
                            :
                            <>
                                <ImageList variant="masonry" cols={2} gap={8}>
                                    {
                                        journey.photos.map((file, index) => {
                                            return (
                                                <ImageListItem key={index}>
                                                    <img
                                                        alt={index}
                                                        src={`/photo/${file}`}
                                                        srcSet={`/photo/${file}`}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                            )
                                        })
                                    }
                                </ImageList>
                            </>
                    }
                </Box>
            </Paper>
        </>
    );
}