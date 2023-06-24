import React, {useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Paper, Container, TextField, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './JourneyList.css';
import AddIcon from "@mui/icons-material/Add";

import CreateIcon from '@mui/icons-material/Create';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {travelState} from "../../states/travel";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import NewJourneyPill from "./NewJourneyPill";
import JourneyPill from "./JourneyPill";
import dayjs from "dayjs";

/**
 * Journey 정보를 보여주는 컴포넌트
 * @param travel
 */
export default function JourneyList({ travel }) {
    console.log('travel', travel);
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const setTravels = useSetRecoilState(travelState);
    const[isTitleEditing, setIsTitleEditing] = useState(false);
    const[isEditingNewJourneyState, setIsEditingNewJourneyState] = useState(false);

    const sortedJourneys = [...travel.journeys].sort((a, b) => a.date.localeCompare(b.date));

    let startDate = '';
    let endDate = '';
    if(sortedJourneys && sortedJourneys.length > 0) {
        startDate = dayjs(sortedJourneys[0].date).format("YYYY년 MM월 DD일");
        endDate = dayjs(sortedJourneys[sortedJourneys.length - 1].date).format("YYYY년 MM월 DD일");
    }

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
                    title: e.target.value,
                });

                await apiv1.patch("/travel/" + travel.id, titleJson)
                    .then((response) => {
                        if (response.status === 200) {
                            setTravels(response.data);
                        }
                    });

            }
            setIsTitleEditing(false);
        }
    }

    return (
        <>
            <Paper sx={{
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                {/*UI상태 - 보기*/}
                {/* 타이틀 사진 영역 */}
                <Box
                    className="journeyList-box"
                    sx={{
                        backgroundColor: '#cecece',
                        marginBottom: '5px',
                    }}
                >
                    <ArrowBackIosIcon/>
                </Box>

                {/* 타이틀 영역 */}
                <div align="center" className="journeyList-title">
                    {
                        isTitleEditing ?
                            <>
                                <TextField
                                    id="travel-title"
                                    defaultValue={travel.title}
                                    hiddenLabel
                                    variant="standard"
                                    onKeyDown={onKeyDownRename}
                                    onBlur={() => setIsTitleEditing(false)}
                                />
                            </>
                            :
                            <>
                                <Typography variant='h5'>
                                    {travel.title}
                                    <CreateIcon
                                        onClick={() => setIsTitleEditing(true)}
                                    />
                                </Typography>
                            </>
                    }
                    <Typography variant='subtitle1'>
                        {sortedJourneys && sortedJourneys.length > 0 ? startDate + ' ~ ' + endDate : ''}
                    </Typography>
                </div>

                {
                    travel.journeys.map(journey => <JourneyPill key={journey.id} journey={journey} />)
                }

                {/*Jorney 추가 영역*/}
                <Box
                    className="journeyList-add-box"
                    onClick={() => {
                        setIsEditingNewJourneyState(!isEditingNewJourneyState)
                    }}
                >
                    <AddIcon sx={{fontSize: '60px'}}/>
                    <Typography>
                        Click to add new Journey
                    </Typography>
                </Box>
            </Paper>

            {
                /* 여정 글쓰기 */
                isEditingNewJourneyState && <NewJourneyPill travel={travel} editingCancel={() => setIsEditingNewJourneyState(false)}/>
            }
        </>
    )
}