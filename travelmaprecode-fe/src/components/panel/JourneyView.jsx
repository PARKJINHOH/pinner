import React, {useCallback, useEffect, useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Button, ImageList, ImageListItem, ImageListItemBar, imageListItemClasses, Input, Paper, Typography} from "@mui/material";
import './JourneyView.css';

import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import dayjs from "dayjs";
import {selectedTravelState, travelState} from "../../states/travel";
import {NewJourneyStep, newJourneyStepState, newLocationState} from "../../states/modal";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Tags from "@yaireo/tagify/dist/react.tagify";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import toast from "react-hot-toast";

/**
 * Journey 보기 및 수정
 * @param travel
 */
export default function JourneyView({travelId, journey, viewCancel}) {
    console.log('JourneyView', journey);
    const apiv1 = useAPIv1();

    const [editMode, setEditMode] = useState(false);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);
    const [travelData, setTravelData] = useRecoilState(travelState);

    const _setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    const [pickerDate, setPickerDate] = useState(null);
    const [hashTags, setHashTags] = useState(null)
    const [photos, setPhotos] = useState([]);
    const removePhoto = (idx) => setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    /**
     * 1. POST 요청
     * 2. 응답결과가 정상일 경우
     */
    const onCreate = async () => {

        // 사진 업로드
        // let photoIds = [];
        // try {
        //     photoIds = await Promise.all(photos.map(uploadImage));
        // } catch (err) {
        //     console.error(`failed to upload photos: ${err}`);
        //     toast.error("사진을 업로드 하지 못했어요.")
        //     return;
        // }

        // Journey 생성
        const journeyData = {};
        if (newLocation.name !== '') {
            journeyData.geoLocation = newLocation;
            setNewLocation({lat: 0,lng: 0,name: "",});
        }
        if (pickerDate) {
            journeyData.date = dayjs(pickerDate).format('YYYY-MM-DD');
        }
        if (hashTags) {
            journeyData.hashTags = hashTags;
        }
        // if (photos.length) {
        //     journeyData.photos = photoIds;
        // }

        if (JSON.stringify(journeyData) !== '{}') {
            console.log('journeyData : ', JSON.stringify(journeyData));
            await apiv1.put(`/travel/${travelId}/journey/${journey.id}`, JSON.stringify(journeyData))
                .then((response) => {
                    if (response.status === 200) {
                        // 화면이 꺼짐
                        _setTravels(response.data);
                    }
                });
        }

    }


    const addPhotos = (newPhotos) => {
        console.log("사진 추가");
        let limitPhoto = 8; // 최대 사진 갯수

        const currentPhotoCount = photos.length;
        const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
        const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
        const combinedPhotos = [...photos, ...additionalPhotos];
        setPhotos(combinedPhotos);
    };


    /**
     * HashTag
     */
    const onHashTagChange = useCallback((e) => {
        let map = e.detail.tagify.value.map(e =>
            e.value
        );
        setHashTags(map);
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
                    <div className="journeyView-title-group">
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
                                        className="journeyView-title"
                                        placeholder="여행한 장소를 입력해주세요."
                                        inputProps={{maxLength: 50}}
                                        value={newLocation.name != "" ? newLocation.name : journey.geoLocationDto.name}
                                        onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                                    />
                                    <LocationOnIcon
                                        sx={{cursor: 'pointer'}}
                                        className="journeyView-location"
                                        onClick={() => {
                                            toast('지도를 클릭해주세요', {duration: 3000,});
                                            setNewJourneyStep(NewJourneyStep.LOCATING);
                                        }}
                                    />
                                </>
                                :
                                <Typography variant="h6" className="journeyView-title">
                                    {journey.geoLocationDto.name}
                                </Typography>
                        }
                    </div>
                    <div className="journeyView-date">
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
                    <div className="journeyView-tag-div">
                        {
                            editMode ?
                            <>
                                <Tags
                                    className="journeyView-tags"
                                    settings={{maxTags: '5'}}
                                    onChange={onHashTagChange}
                                    placeholder='태그 최대 5개'
                                    defaultValue={hashTags ? hashTags : journey.hashtags}
                                />
                            </>
                            :
                            <>
                                {
                                    journey.hashtags.map((tag, index) => (
                                            <div key={index} className="journeyView-tag">{tag}</div>
                                        )
                                    )
                                }
                            </>
                        }
                    </div>
                </Box>
                <Box className="journeyView-edit">
                    {
                        editMode ?
                            <CheckCircleOutlineIcon
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    setEditMode(!editMode);
                                    onCreate();
                                }}
                            />
                            :
                            <ModeEditIcon
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    setEditMode(!editMode);
                                }}
                            />
                    }

                </Box>
                <Box className="journeyView-imageBox">
                    {
                        editMode ?
                            <>
                                <ImageList variant="masonry" cols={2} gap={8}>
                                    {
                                        journey.photos && journey.photos.map((file, index) => {
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
                                                        src={`/photo/${file}`}
                                                        srcSet={`/photo/${file}`}
                                                        loading="lazy"
                                                        alt="tmpImg"
                                                    />
                                                </ImageListItem>
                                            );
                                        })
                                    }
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
                                <Dropzone className="journeyView-add-picture"
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