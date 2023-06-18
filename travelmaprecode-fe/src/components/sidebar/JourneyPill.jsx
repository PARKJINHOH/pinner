import React from 'react';

import {Box, Container, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './JourneyPill.css';
import AddIcon from "@mui/icons-material/Add";

/**
 * Journey 상세 정보를 보여주는 컴포넌트
 * @param travel
 */
export default function JourneyPill({ travel }) {
    console.log('travel', travel);

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
                <Typography variant='h5'>
                    {travel.title}
                </Typography>
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