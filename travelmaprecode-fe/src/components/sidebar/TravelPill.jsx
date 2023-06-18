import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyPill from "./JourneyPill";

import { useAPIv1 } from '../../apis/apiv1';
import { googleMapState } from '../../states/map';
import { centerOfPoints, radiusOfPoints } from '../../utils';

import {Box, Paper, Typography} from '@mui/material';
import Stack from "@mui/material/Stack";

const journeyPanelWidth = 350; // 패널 너비

/**
 * 여행 목록(Travel List)에서의 여행(Travel) 컴포넌트
 * @param travel
 */
export default function TravelPill({ travel }) {
    const [travelListViewWidth, setTravelListViewWidth] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(null);

    useEffect(() => {
        const travelListView = document.getElementById("travelListView");
        const sidebar = document.getElementById("sidebar");

        if (travelListView) {
            // travelListView의 너비 가지고와서 저장
            setTravelListViewWidth(travelListView.offsetWidth);
        }

        if (sidebar) {
            // sidebar의 너비 가지고와서 저장
            setSidebarWidth(sidebar.offsetWidth);
        }
    }, []);

    const [isRenaming, setIsRenaming] = useState(false);

    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);

    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);
    const isSelected = travel.id === selectedId;

    const apiv1 = useAPIv1();

    const setTravels = useSetRecoilState(travelState);

    // 맵 위치를 여행의 중심으로 이동
    const [gMap, setGMap] = useRecoilState(googleMapState);

    const journeyList = travel.journeys;
    const uniqueDate = [...new Set(journeyList.map((v) => v.date))]
    const newData = uniqueDate.reduce(
        (acc, v) => [...acc, [...journeyList.filter((d) => d.date === v)]], []
    );

    // journeySideBar 상태
    const [selectedTravelId, setSelectedTravelId] = useRecoilState(selectedTravelIdState);

    function onJourneyClick() {
        console.log(travel);
        if (selectedTravelId === travel.id) {
            setSelectedTravelId('');
            return;
        }
        setSelectedTravelId(travel.id);
    }

    function onFoldingClick() {
        if (isSelected) {
            setSelectedId(null);
        } else {
            setSelectedId(travel.id);

            if (travel.journeys.length !== 0) {
                moveMaptoCenterofJourneys(travel.journeys)
            }
        }
    }

    function moveMaptoCenterofJourneys(journeys) {
        // TODO: Radius 에 따라서 줌 레벨 동적으로 조정?
        // let radius = radiusOfPoints(travel.journeys.map(j => j.geoLocationDto));
        const points = journeys.map(j => j.geoLocationDto);
        const centerOfTravel = centerOfPoints(points);
        setGMap({ zoom: gMap.zoom, center: centerOfTravel });
    }

    const onDeleteClick = async (e) => {
        setAnchorEl(null);
        await apiv1.delete("/travel/" + travel.id)
            .then((response) => {
                if (response.status === 200) {
                    setTravels(response.data);
                } else {
                    alert(response.data);
                }
            });
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
            setIsRenaming(false);
        }
    }

    // 이름 변경 시작
    function onRenameClick(e) {
        e.stopPropagation();
        setIsRenaming(true);
        setAnchorEl(null);
    }

    const renameTextInput = <input type="text" autoFocus={true} onKeyDown={onKeyDownRename} onBlur={() => setIsRenaming(false)}></input>;
    // 이름 변경 끝

    // Travel 사이드 메뉴 시작
    function onNewJourneyClick() {
        setAnchorEl(null);
        toast((t) => (<span>
            어디를 여행하셨나요?
            지도를 클릭해서 Journey를 추가해요.
        </span>));
        setNewJourneyStep(NewJourneyStep.LOCATING);
        setSelectedId(travel.id);
    }


    const [anchorEl, setAnchorEl] = useState(null);
    const showDropdownMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);
    // Travel 사이드 메뉴 끝

    const travelTitle =
        <Box sx={{ marginLeft: '10px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {travel.title}
            </Typography>
        </Box>;

    return (
        <>
            <Stack
                direction="column"
                sx={{marginBottom: '15px'}}
                onClick={onJourneyClick}
            >
                <Box
                    className="travel-box"
                    sx={{
                        backgroundColor: '#cecece',
                        marginBottom: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {travel.journeys.size > 0 ? (
                        <img src={travel.journeys[0].image} alt="travel" width="100%" height="100%"/>
                    ) : (
                        <Typography align="center" color="textSecondary">
                            사진 없음
                        </Typography>
                    )}
                </Box>
                {isRenaming ? renameTextInput : travelTitle}
            </Stack>

            {
                selectedTravelId === travel.id && (
                    <Paper sx={{
                        width: journeyPanelWidth, position: 'fixed', borderRadius: 0,
                        height: '100vh', top: 0, left: travelListViewWidth + sidebarWidth, zIndex: '9',
                        overflow: 'auto', // 스크롤바 추가
                    }}>
                        <JourneyPill travel={travel}/>
                    </Paper>
                )
            }
        </>
    )
}

function JourneyDatePill({ journeys }) {
    let journeyCnt = 0;

    function drawDateTitle() {
        return <div>
            <b key={journeys[0].id}>{journeys[0].date}</b>
            <hr style={{ margin: 2 }}></hr>
        </div>;
    }

    function drawJourneyPills() {
        journeyCnt++;
        let lineYn = true;
        if (journeyCnt === journeys.length) {
            lineYn = false;
        }
        return journeys.map(journey => <JourneyPill key={journey.id} journey={journey} lineYn={lineYn} />);
    }

    return (
        <li>
            {drawDateTitle()}
            <ul>
                {drawJourneyPills()}
            </ul>
        </li>
    )
}