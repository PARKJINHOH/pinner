import React, {useState} from 'react';

import {Box, Chip, Container, Typography} from "@mui/material";
import './JourneyPill.css';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {travelState} from "../../states/travel";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import dayjs from "dayjs";
import {representPhotoIdOfJourney} from '../../common/travelutils';
import RepresentImage from './RepresentImage';
import JourneyView from "./JourneyView";

/**
 * Journey 정보를 보여주는 컴포넌트
 * @param {Journey} journey
 */
export default function JourneyPill({journey}) {
    console.log('JourneyPill', journey);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const setTravels = useSetRecoilState(travelState);

    const [isJourneyViewState, setIsJourneyViewState] = useState(false);

    const journeyPhotoCnt = journey.photos.length;
    const journeyDate = dayjs(journey.date).format("YYYY년 MM월 DD일");


    const photoId = representPhotoIdOfJourney(journey);

    function onJourneyViewClick() {
        setIsJourneyViewState(true);
    }


    return (
        <>
            <Container maxWidth="sm" className="journeyPill-container"
                       onClick={onJourneyViewClick}
            >
                <Box className="journeyPill-box">
                    <div className="journeyPill-thumbnail">
                        {
                            photoId !== null ?
                                <RepresentImage photoId={photoId}></RepresentImage>
                                :
                                <Typography color="textSecondary">
                                    사진 없음
                                </Typography>
                        }
                    </div>
                    <div className="journeyPill-info">
                        <Chip size="small" sx={{backgroundColor: '#5b5b5b', color: 'white'}}
                              label={journeyDate}
                        />
                        <Chip size="small" sx={{backgroundColor: '#5b5b5b', color: 'white', marginLeft: '90px'}}
                              label={`${journeyPhotoCnt} 이미지`}
                        />
                    </div>
                </Box>
                <Typography variant='h6'>{journey.geoLocationDto.name}</Typography>
                {
                    journey.hashtags.map((tag, index) => (
                            <div key={index} className="journeyPill-tag">{tag}</div>
                        )
                    )
                }
            </Container>

            {
                // 여정(Journey)목록 리스트 패널
                isJourneyViewState && <JourneyView journey={journey} viewCancel={() => setIsJourneyViewState(false)}/>
            }
        </>
    );
}