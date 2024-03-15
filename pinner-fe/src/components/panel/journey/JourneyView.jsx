import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

// api
import { HTTPStatus, useAPIv1 } from 'apis/apiv1';

// css
import style from './JourneyView.module.css';

// component
import { NewJourneyStep, newJourneyStepState, newLocationState } from "states/modal";
import { journeyListViewWidth, sidebarWidth, travelListViewWidth } from "states/panel/panelWidth";
import { selectedTravelState, travelState } from "states/travel";
import LightBoxPill from "components/panel/journey/LightBoxPill.jsx";

// mui
import { Input, Tooltip } from "@mui/joy";
import { Alert, Autocomplete, Box, Button, CircularProgress, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Icon
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ReactComponent as EditIcon } from 'assets/images/edit-outline-icon.svg';

// mantine
import { Divider } from "@mantine/core";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

// etc
import Tags from "@yaireo/tagify/dist/react.tagify";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import iso3166_1 from "apis/iso3166_1.json";

/**
 * Journey 보기 및 수정
 * @param travel
 */
export default function JourneyView({ readOnly, travelId, journey, viewCancel }) {
    const apiv1 = useAPIv1();
    const inputRef = useRef(null);

    const EditMode = {
        DEFAULT: '',
        EDIT: 'EDIT',
        DELETE: 'DELETE',
    }
    const [editMode, setEditMode] = useState(EditMode.DEFAULT);

    const selectedTravel = useRecoilValue(selectedTravelState);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    const [pickerDate, setPickerDate] = useState(null);
    const [hashtags, setHashtags] = useState([])
    const [photos, setPhotos] = useState([]);
    const [countryKrNm, setCountryKrNm] = useState(null);

    const [saving, setSaving] = useState(false);

    // const [countries, setCountries] = useState(iso3166_1);
    const countries = iso3166_1;


    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [lightBoxPhotos, setLightBoxPhotos] = useState([]);

    const removePhoto = (idx) => setPhotos([...photos.slice(0, idx), ...photos.slice(idx + 1, photos.length)]);

    useEffect(() => {
        // Edit 데이터 세팅
        setNewLocation({ lat: 0, lng: 0, name: "", countryCd: "" });
        setHashtags(journey.hashtags);
        setPhotos([]);
        const hasCountry = countries.find((country) => country.country_iso_alp2 === journey.geoLocationDto.countryCd);
        if (hasCountry) {
            setCountryKrNm(hasCountry.country_nm);
        }

        journey.photos.map(async (photo) => {
            const imageUrl = photo.src;
            // 이미지 URL을 Blob 객체로 가져오기
            await fetch(imageUrl)
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

    useEffect(() => {
        const countryCdToFind = newLocation.countryCd;
        const hasCountry = countries.find((country) => country.country_iso_alp2 === countryCdToFind);

        if (hasCountry) {
            setCountryKrNm(hasCountry.country_nm);
        }

    }, [newLocation]);

    async function onCreate() {
        // 사진 최대 용량 (10MB)
        const maxPhotoSize = 10475274;

        if (saving) {
            return;
        }

        if (!newLocation.name && !journey.geoLocationDto) {
            toast.error("여행한 지역을 선택해주세요.");
            return;
        }
        if (hashtags.length === 0) {
            toast.error("여행을 대표하는 태그를 1개 이상 입력해주세요.");
            return;
        }
        if (photos.length !== 0 && hasExceededSize(photos, maxPhotoSize)) {
            toast.error('10MB 이하 파일만 등록할 수 있습니다.');
            return;
        } else if (photos.length === 0 && !window.confirm('사진이 없습니다. 그래도 저장하시겠습니까?\n(저장 후 수정으로 사진 추가가 가능합니다.)')) {
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            if (photos.length !== 0) {
                photos.forEach(photo => {
                    formData.append('photo', photo);
                });
            }
            const journeyData = JSON.stringify({
                date: dayjs(pickerDate || journey.date).format('YYYY-MM-DD'),
                geoLocation: newLocation.name !== "" ? newLocation : journey.geoLocationDto,
                hashtags: hashtags
            });
            formData.append('newJourney', new Blob([journeyData], { type: 'application/json' }));

            await apiv1.put(`/journey/${journey.id}`, formData)
                .then((response) => {
                    setTravels(response.data);
                    viewCancel();
                });

        } catch (error) {
            toast.error('여정을 수정하지 못했습니다.');
        } finally {
            setSaving(false);
        }
    }

    function hasExceededSize(photos, maxPhotoSize) {
        return photos.some(photo => photo.size > maxPhotoSize);
    }

    const onClickAddPhotos = (event) => {
        // 개별사진 10MB, 총합 최대 100MB
        let limitPhoto = 10; // 최대 사진 갯수

        const files = event.target.files;
        if (files && files.length > 0) {
            const newPhotos = Array.from(files); // FileList를 배열로 변환하여 newPhotos 배열에 추가

            if (newPhotos.length + photos.length > 10) {
                toast.error('사진 갯수는 최대 10장입니다.');
                return;
            }
            const currentPhotoCount = photos.length;
            const additionalPhotoCount = Math.min(newPhotos.length, limitPhoto - currentPhotoCount);
            const additionalPhotos = newPhotos.slice(0, additionalPhotoCount);
            const combinedPhotos = [...photos, ...additionalPhotos];
            setPhotos(combinedPhotos);
        }
    };


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

    function setLocationTitle(title) {
        if (title.length > 50) {
            toast("50글자 이내로 입력해주세요");
            return;
        }

        setNewLocation({ ...newLocation, name: title });
    }

    function fnLightBoxOpen(photoId) {
        if (journey.photos) {
            const tempPhotos = journey.photos.slice();
            const clickedPhotoIndex = tempPhotos.findIndex((photo) => photo.id === photoId);
            const clickedPhoto = tempPhotos.splice(clickedPhotoIndex, 1)[0];
            setLightBoxPhotos([clickedPhoto, ...tempPhotos]);
            setLightBoxOpen(true);
        }
    }

    return (
        <>
            <Paper
                className={style.root_paper}
                sx={{ width: _journeyPanelWidth, left: _sidebarWidth + _travelListViewWidth }}
            >
                <Box>
                    <>
                        {
                            editMode === EditMode.EDIT ?
                                <div className={style.edit_location}>
                                    <Input
                                        sx={{ '--Input-gap': '1px' }}
                                        label="여행한 장소를 입력해주세요."
                                        startDecorator={
                                            <LocationOnIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    toast.info('지도를 클릭해주세요', { duration: 2000, });
                                                    setNewJourneyStep(NewJourneyStep.LOCATING);
                                                }}
                                            />
                                        }
                                        value={newLocation.name !== "" ? newLocation.name : journey.geoLocationDto.name}
                                        onChange={e => setLocationTitle(e.target.value)}
                                        fullWidth
                                    />
                                </div>
                                :
                                <div className={style.view_location}>
                                    <Typography sx={{ fontSize: '21px', fontWeight: 'bold' }}>
                                        {journey.geoLocationDto.name}
                                    </Typography>
                                </div>
                        }
                    </>
                    <>
                        {
                            editMode === EditMode.EDIT ?
                                <div className={style.edit_country_date}>
                                    <Autocomplete
                                        value={countryKrNm}
                                        onChange={(event, newValue) => {
                                            setCountryKrNm(newValue.country_nm);
                                        }}
                                        sx={{ width: '70%' }}
                                        options={countries}
                                        autoHighlight
                                        getOptionLabel={(option) => option.country_nm || option}
                                        isOptionEqualToValue={(option, newValue) => {
                                            return option.country_nm === newValue;
                                        }}
                                        renderOption={(props, country) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`https://flagcdn.com/w20/${country.country_iso_alp2.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w40/${country.country_iso_alp2.toLowerCase()}.png 2x`}
                                                    alt=""
                                                />
                                                {country.country_nm}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="국가를 선택해주세요."
                                            />
                                        )}
                                    />
                                    <Divider sx={{ marginLeft: '11px' }} orientation="vertical" />
                                    <div className={style.edit_date}>
                                        <Typography sx={{ fontSize: '16px' }}>여행날짜</Typography>
                                        <ButtonDatePicker
                                            sx={{ cursor: 'pointer' }}
                                            label={pickerDate ? `${pickerDate.format('YYYY-MM-DD')}` : dayjs(journey.date).format('YYYY-MM-DD')}
                                            value={dayjs(journey.date)}
                                            onChange={(newPickerDate) => setPickerDate(newPickerDate)}
                                        />
                                    </div>
                                </div>
                                :
                                <div className={style.view_country_date}>
                                    <Typography>
                                        {dayjs(journey.date).format("YYYY.MM.DD")}
                                    </Typography>
                                </div>
                        }

                    </>
                    <>
                        {
                            editMode === EditMode.EDIT ?
                                <div>
                                    <Tags
                                        className={style.edit_tags}
                                        settings={{ maxTags: '5' }}
                                        onChange={onHashTagChange}
                                        placeholder='태그 최대 5개'
                                        defaultValue={hashtags.length !== 0 ? hashtags : journey.hashtags}
                                    />
                                </div>
                                :
                                <div className={style.view_tags}>
                                    {
                                        journey.hashtags.map((tag, index) => (
                                            <div key={index} className={style.view_tag}>{tag}</div>
                                        )
                                        )
                                    }
                                </div>
                        }
                    </>
                </Box>
                <Box>
                    {
                        editMode === EditMode.EDIT ?
                            <div className={style.edit_tool}>
                                <IconButton
                                    className={style.arrow_icon_btn}
                                    onClick={() => {
                                        viewCancel();
                                    }}
                                >
                                    <ArrowBackIosOutlinedIcon
                                        sx={{ fontSize: '30px' }}
                                    />
                                </IconButton>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept={IMAGE_MIME_TYPE} // 이미지 파일만 선택할 수 있도록 설정
                                    style={{ display: 'none' }}
                                    onChange={onClickAddPhotos}
                                    multiple
                                />
                                <label className={style.add_icon}>
                                    <Tooltip title="사진 추가" variant="outlined" size="lg">
                                        <AddBoxOutlinedIcon
                                            sx={{ fontSize: '30px' }}
                                            onClick={() => inputRef.current.click()}
                                        />
                                    </Tooltip>
                                </label>
                                <Tooltip title="저장" variant="outlined" size="lg">
                                    <CheckBoxOutlinedIcon
                                        className={style.save_icon}
                                        sx={{
                                            fontSize: '30px',
                                            color: saving ? 'gray' : '#10bb00',
                                            pointerEvents: saving ? 'none' : 'auto',
                                        }}
                                        onClick={onCreate}
                                    />
                                </Tooltip>
                            </div>
                            :
                            // 공유 받은 트레블이 아닐 경우에만 수정 가능
                            !selectedTravel.sharedInfo &&
                                <div className={style.view_tool}>
                                    <IconButton
                                        className={style.arrow_icon_btn}
                                        onClick={() => {
                                            viewCancel();
                                        }}
                                    >
                                        <ArrowBackIosOutlinedIcon
                                            sx={{ fontSize: '30px' }}
                                        />
                                    </IconButton>
                                    <Tooltip title="여정 수정" variant="outlined" size="lg">
                                        <EditIcon
                                            className={style.edit_icon}
                                            onClick={() => {
                                                setEditMode(EditMode.EDIT);
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                    }
                </Box>

                <Divider />

                <Box className={style.journeyView_imageBox}>
                    {
                        editMode === EditMode.EDIT ?
                            <>
                                {saving && (
                                    <CircularProgress
                                        className={style.saving_icon}
                                        size={48}
                                    />
                                )}
                                {
                                    photos.length > 0 ?
                                        <ImageList variant="masonry" cols={2} gap={8}>
                                            {photos.map((photo, index) => {
                                                const tmpPhotoUrl = URL.createObjectURL(photo);
                                                return (
                                                    <ImageListItem key={index}>
                                                        <ImageListItemBar
                                                            sx={{
                                                                background: "transparent"
                                                            }}
                                                            position="top"
                                                            actionPosition="left"
                                                            actionIcon={
                                                                <IconButton
                                                                    sx={{ color: 'red' }}
                                                                    onClick={() => removePhoto(index)}>
                                                                    <DeleteForeverOutlinedIcon />
                                                                </IconButton>
                                                            }
                                                        />
                                                        <img
                                                            style={{ border: photo.size > 10400000 ? '3px solid red' : '1px solid #cbcbcb' }}
                                                            src={tmpPhotoUrl}
                                                            srcSet={tmpPhotoUrl}
                                                            loading="lazy"
                                                            alt="tmpImg"
                                                        />
                                                    </ImageListItem>
                                                );
                                            })}
                                        </ImageList>
                                        :
                                        <div className={style.no_picture}>
                                            <Stack sx={{ width: '80%' }}>
                                                <Alert variant="outlined" severity="info" sx={{ justifyContent: 'center' }}>
                                                    사진을 추가해주세요.
                                                </Alert>
                                            </Stack>
                                        </div>
                                }
                            </>
                            :
                            <>
                                <ImageList variant="quilted" cols={2} gap={8}>
                                    {
                                        journey.photos.map((photo, index) => {
                                            const aspectRatio = photo.width / photo.height;
                                            const rows = aspectRatio > 1 ? 1 : 2;

                                            return (
                                                <ImageListItem key={index} cols={1} rows={rows}>
                                                    <img
                                                        className={style.view_photo}
                                                        alt={index}
                                                        src={photo.src}
                                                        srcSet={photo.src}
                                                        loading="lazy"
                                                        onClick={() => fnLightBoxOpen(photo.id)}
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

            {lightBoxOpen && (
                <LightBoxPill
                    photo={lightBoxPhotos}
                    open={lightBoxOpen}
                    setOpen={setLightBoxOpen}
                />
            )}
        </>
    );
}