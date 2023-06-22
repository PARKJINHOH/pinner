import React, {useCallback, useEffect, useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Button, ImageList, ImageListItem, ImageListItemBar, imageListItemClasses, Input, Paper, Typography} from "@mui/material";
import './NewJourneyPill.css';

import {useRecoilValue} from "recoil";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

import Tags from "@yaireo/tagify/dist/react.tagify";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import IconButton from "@mui/material/IconButton";
import {Divider} from "@mantine/core";


/**
 * Journey 글쓰기 컴포넌트
 * @param travel
 */
export default function NewJourneyPill({ travel, editingCancel }) {
    console.log('travel', travel);
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const currentDate = dayjs().format('YYYY-MM-DD');
    const [pickerDate, setPickerDate] = useState(dayjs(currentDate));

    const [hashTags, setHashTags] = useState([]);
    // 이미지 포스팅
    const [photos, _setPhotos] = useState([]);
    const removePhoto = (idx) => _setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    /**
     * HashTag
     */
    const onHashTagChange = useCallback((e) => {
        let map = e.detail.tagify.value.map(e =>
            e.value
        );
        setHashTags(map);
    }, []);

    const addPhotos = (newPhotos) => {
        let limitPhoto = 8; // 최대 사진 갯수

        const currentPhotoCount = photos.length;
        const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
        const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
        const combinedPhotos = [...photos, ...additionalPhotos];
        console.log(photos);
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
            <Paper sx={{
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box className="newJourney-box">
                    <div className="newJourney-arrowBack">
                        <ArrowBackIosIcon
                            sx={{marginLeft: 2}}
                            onClick={() => {
                                editingCancel();
                            }}
                        />
                        <Input
                            placeholder="여행한 장소를 입력해주세요.(13자 이내)"
                            sx={{width: 285, fontSize:14, height: 40}}
                            inputProps={{maxLength: 13}}
                        />
                    </div>
                    <div className="newJourney-date">
                        <ButtonDatePicker
                            label={`${pickerDate.format('YYYY-MM-DD')}`}
                            value={pickerDate}
                            onChange={(newPickerDate) => setPickerDate(newPickerDate)}
                        />
                    </div>
                    <div className="newJourney-tags-div">
                        <Tags
                            className="newJourney-tags"
                            settings={{ maxTags: '5' }}
                            onChange={onHashTagChange}
                            placeholder='태그 최대 5개'
                        />
                    </div>
                </Box>
                <Box className="newJourney-imageBox">
                    <ImageList variant="masonry" cols={2} gap={8}>
                        {photos.map((file, index) => {
                            const tmpPhotoUrl = URL.createObjectURL(file);
                            return (
                                <ImageListItem key={file.img}>
                                    <ImageListItemBar
                                        sx={{
                                            background: "transparent"
                                        }}
                                        position="top"
                                        actionPosition="right"
                                        actionIcon={
                                            <IconButton onClick={() => removePhoto(index)}>
                                                <DeleteForeverIcon fontSize="small" />
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
                    <Dropzone className="newJourney-add-picture"
                              key={"dropzone"} accept={IMAGE_MIME_TYPE} onDrop={addPhotos}>
                        <Typography variant="p" align="center" color="textSecondary">
                            클릭 혹은 <br/>
                            드래그 앤 드랍으로 <br/>
                            사진 추가
                        </Typography>
                    </Dropzone>
                </Box>

            </Paper>
        </>
    )
}