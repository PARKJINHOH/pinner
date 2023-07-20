import React, {useEffect, useRef, useState} from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";

// api
import { useAPIv1 } from '../../../apis/apiv1'

// css
import style from './JourneyList.module.css';

// component
import { travelState } from "../../../states/travel";
import { journeyListViewWidth, sidebarWidth, travelListViewWidth } from "../../../states/panel/panelWidth";
import NewJourneyPill from "./NewJourneyPill";
import JourneyPill from "./JourneyPill";
import { representPhotoIdOfTravel } from '../../../common/travelutils';
import RepresentImage from '../RepresentImage';

// mui
import {Box, IconButton, Paper, Stack, TextField, Typography} from "@mui/material";
import { ChevronLeft } from '@mui/icons-material';

// mui Icon & images
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import {ReactComponent as EditIcon} from 'assets/images/edit-outline-icon.svg';

// etc
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
import {Divider} from "@mantine/core";


/**
 * Journey 정보를 보여주는 컴포넌트
 * @param travel
 */
export default function JourneyList({ travel }) {
    const EditMode = {
        DEFAULT: '',
        EDIT: 'EDIT',
        DELETE: 'DELETE',
    }

    const apiv1 = useAPIv1();
    const textFieldRef = useRef(null);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const setTravels = useSetRecoilState(travelState);
    const [editMode, setEditMode] = useState(EditMode.DEFAULT);
    const [isEditingNewJourneyState, setIsEditingNewJourneyState] = useState(false);

    const sortedJourneys = [...travel.journeys].sort((a, b) => a.date.localeCompare(b.date));

    let startDate = '';
    let endDate = '';
    if (sortedJourneys && sortedJourneys.length > 0) {
        startDate = dayjs(sortedJourneys[0].date).format("YYYY년 MM월 DD일");
        endDate = dayjs(sortedJourneys[sortedJourneys.length - 1].date).format("YYYY년 MM월 DD일");
    }

    useEffect(() => {
        if (editMode === EditMode.EDIT && textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [editMode]);

    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
    */
    async function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";

        if (isEsc || isEnter) {
            e.preventDefault();
            if (isEnter) {
                const titleJson = JSON.stringify({
                    title: e.target.value.trim(),
                });

                await apiv1.patch("/travel/" + travel.id, titleJson)
                    .then((response) => {
                        if (response.status === 200) {
                            setTravels(response.data);
                        }
                    });

            }
            setEditMode(EditMode.DEFAULT);
        }
    }

    /**
     *
     * @param {Object} obj
     * @param {Travel} obj.travel
     * @param {function (): void} obj.onClick
     *
     * @returns {JSX.Element}
     */
    function RepresentImageWithButton({ travel, onClick }) {
        const photoId = representPhotoIdOfTravel(travel);

        if (photoId === null) {
            return <div className={style.main_preview} />;
        }

        return (
            <div style={{ aspectRatio: 16 / 10, }}>
                {/* Button */}
                <IconButton
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', p: 0, m: 1, zIndex: 1 }}
                    style={{ position: 'absolute' }}
                    onClick={onClick}
                >
                    <ChevronLeft
                        sx={{ color: 'rgba(0, 0, 0, 0.7)', }}
                        fontSize='large'
                    />
                </IconButton>

                {/* RepresentImage */}
                <RepresentImage photoId={photoId}></RepresentImage>
            </div >
        )
    }

    return (
        <>
            <Paper
                className={style.root_paper}
                sx={{width: _journeyPanelWidth, left: _sidebarWidth + _travelListViewWidth,}}
            >
                <div>
                    {/* 타이틀 사진 영역 */}
                    <RepresentImageWithButton travel={travel}/>

                    {/* 타이틀 영역 */}
                    <div align="center" className={style.travel_title_group}>
                        {
                            editMode === EditMode.EDIT ?
                                <>
                                    <TextField
                                        inputProps={{ maxLength: 10, style: {fontSize: 20} }}
                                        style={{ width: 250 }}
                                        defaultValue={travel.title}
                                        variant="standard"
                                        onKeyDown={onKeyDownRename}
                                        onBlur={() => setEditMode(EditMode.DEFAULT)}
                                        inputRef={textFieldRef}
                                    />
                                </>
                                :
                                <>
                                    <Typography sx={{fontSize: '25px', fontWeight: 'bold'}}>
                                        {travel.title}
                                    </Typography>
                                </>
                        }
                        <Typography variant='subtitle1'>
                            {sortedJourneys && sortedJourneys.length > 0 ? startDate + ' ~ ' + endDate : ''}
                        </Typography>
                    </div>

                    <div className={style.journey_tool}>
                        <AddBoxOutlinedIcon
                            sx={{fontSize: '30px'}}
                            className={style.add_icon}
                            onClick={() => {
                                setIsEditingNewJourneyState(!isEditingNewJourneyState);
                            }}
                        />
                        <EditIcon
                            className={style.edit_icon}
                            style={{ pointerEvents: editMode === EditMode.EDIT ? 'none' : 'auto', fill: editMode === EditMode.EDIT ? 'gray' : 'black' }}
                            onClick={() => {
                                setEditMode(prevMode =>
                                    prevMode === EditMode.EDIT ? EditMode.DEFAULT : EditMode.EDIT
                                );
                            }}
                        />
                        <DisabledByDefaultOutlinedIcon
                            sx={{fontSize: '30px'}}
                            className={style.del_icon}
                            style={{ color: editMode === EditMode.DELETE ? 'red' : 'black' }}
                            onClick={() => {
                                setEditMode(prevMode =>
                                    prevMode === EditMode.DELETE ? EditMode.DEFAULT : EditMode.DELETE
                                );
                            }}
                        />
                    </div>
                </div>

                <Divider />

                {
                    travel.journeys.length !== 0 ?
                        travel.journeys.map(journey =>
                            <JourneyPill key={journey.id} travelId={travel.id} editMode={editMode} setEditMode={setEditMode} journey={journey}/>
                        )
                    :
                        <div className={style.no_journey_title}>
                            <Stack sx={{ width: '80%' }} >
                                <Alert variant="outlined" severity="info" sx={{ justifyContent: 'center' }}>
                                    여정을 추가해주세요.
                                </Alert>
                            </Stack>
                        </div>
                }
            </Paper>

            {
                /* 여정 글쓰기 */
                isEditingNewJourneyState && <NewJourneyPill travel={travel} editingCancel={() => setIsEditingNewJourneyState(false)} />
            }
        </>
    )
}