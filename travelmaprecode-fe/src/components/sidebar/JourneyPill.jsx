import React, {useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Container, TextField, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './JourneyPill.css';
import AddIcon from "@mui/icons-material/Add";

import CreateIcon from '@mui/icons-material/Create';
import {useSetRecoilState} from "recoil";
import {travelState} from "../../states/travel";

/**
 * Journey 상세 정보를 보여주는 컴포넌트
 * @param travel
 */
export default function JourneyPill({ travel }) {
    console.log('travel', travel);
    const apiv1 = useAPIv1();

    const setTravels = useSetRecoilState(travelState);

    const[isTitleEditing, setIsTitleEditing] = useState(false);
    const[isDateEditing, setIsDateEditing] = useState(false);

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
        // Todo : 보기 <> 편집(Edit) 변경될 때 UI 변경해야함.
        <>
            {/*UI상태 - 보기*/}
            {/* 타이틀 사진 영역 */}
            <Box
                className="journey-box"
                sx={{
                    backgroundColor: '#cecece',
                    marginBottom: '5px',
                }}
            >
                <ArrowBackIosIcon />
            </Box>

            {/* 타이틀 영역 */}
            <div align="center" className="journey-title">
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
                    {/*{travel.startDate} ~ {travel.endDate}*/}
                    2023.01.01 ~ 2023.12.31
                </Typography>
            </div>


            {/* Journey 목록 영역 */}
            <Container maxWidth="sm" className="journey-conatiner">
                <Box className="journey-list-box">
                {/* 이미지 */}
                </Box>
                <Typography variant='h6'>터키, 이스탄불</Typography>
                <div className="journey-tag">카파도키아</div>
                <div className="journey-tag">괴레메</div>
                <div className="journey-tag">카파도키아</div>
            </Container>
            <Container maxWidth="sm" className="journey-conatiner">
                <Box className="journey-list-box">
                    {/* 이미지 */}
                </Box>
                <Typography variant='h6'>일본, 오사카</Typography>
                <div className="journey-tag">코쿠젠</div>
                <div className="journey-tag">라멘</div>
                <div className="journey-tag">소바</div>
            </Container>
            <Container maxWidth="sm" className="journey-conatiner">
                <Box className="journey-list-box">
                    {/* 이미지 */}
                </Box>
                <Typography variant='h6'>대한민국, 강릉</Typography>
                <div className="journey-tag">강릉만두</div>
                <div className="journey-tag">강릉해변가</div>
            </Container>


            {/*Jorney 추가 영역*/}
            <Box className="journey-add-box">
                <AddIcon sx={{fontSize: '60px'}}/>
                <Typography>
                    Click to add new Journey
                </Typography>
            </Box>
        </>
    )
}