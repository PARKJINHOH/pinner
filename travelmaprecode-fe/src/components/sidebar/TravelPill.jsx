import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyPill from "./JourneyPill";

import { useAPIv1 } from '../../apis/apiv1';
import { googleMapState } from '../../states/map';
import { centerOfPoints, radiusOfPoints } from '../../utils';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Box, Card, Typography } from '@mui/material';

export default function TravelPill({ travel }) {

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


    function onFoldingClick() {
        if (isSelected) {
            setSelectedId(undefined);
        } else {
            let radius = radiusOfPoints(travel.journeys.map(j => j.geoLocationDto));
            const points = travel.journeys.map(j => j.geoLocationDto);
            const centerOfTravel = centerOfPoints(points);

            console.log({ radius });
            console.log(gMap);
            if (isNaN(centerOfTravel.lat) && isNaN(centerOfTravel.lng)) {
                return;
            }

            setGMap({ zoom: gMap.zoom, center: centerOfTravel });
            setSelectedId(travel.id);
        }
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

    const iconAndTitle =
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginLeft: '1rem' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {travel.title}
            </Typography>

            <Box sx={{ flex: 1 }}></Box>

            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={showDropdownMenu ? 'long-menu' : undefined}
                aria-expanded={showDropdownMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            <div onClick={(e) => e.stopPropagation()}>
                <Menu
                    anchorEl={anchorEl}
                    id="long-menu"
                    open={showDropdownMenu}
                    MenuListProps={{ 'aria-labelledby': 'long-button' }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={onRenameClick}>이름변경</MenuItem>
                    <MenuItem onClick={onDeleteClick}>삭제</MenuItem>
                    <MenuItem onClick={onNewJourneyClick}>여행지 생성</MenuItem>
                </Menu>
            </div>
        </Box>;

    return (
        <Box sx={{ margin: 1 }}>
            <MuiAccordion
                sx={{ border: '0.5px solid gray' /* border 스타일 지정 */ }}
                disableGutters={true} /* 확장했을 때 마진 제거 */
            >
                <MuiAccordionSummary
                    onClick={onFoldingClick}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, .05)' /* 배경색 지정 */,
                        flexDirection: "row-reverse", /* Icon 왼쪽으로 */
                    }}
                    expandIcon={
                        <ArrowForwardIosSharpIcon
                            sx={{
                                fontSize: '0.9rem',
                                transform: 'rotate(90deg)',
                            }}
                        />
                    }
                >
                    {isRenaming ? renameTextInput : iconAndTitle}
                </MuiAccordionSummary>
                <AccordionDetails>
                    {newData.map((journeys, i) => <JourneyDatePill key={i} journeys={journeys} />)}
                </AccordionDetails>
            </MuiAccordion>
        </Box>

    )
}

function JourneyDatePill({ journeys }) {
    let journeyCnt = 0;

    function drawDateTitle() {
        return <div className='ms-3'>
            <b key={journeys[0].id}>{journeys[0].date}</b>
            <hr style={{ margin: 4 }}></hr>
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