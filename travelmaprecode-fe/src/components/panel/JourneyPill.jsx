import React, {useState} from 'react';

// css
import style from './JourneyPill.module.css';

import {representPhotoIdOfJourney} from '../../common/travelutils';
import RepresentImage from './RepresentImage';
import JourneyView from "./JourneyView";

// mui
import {Box, Chip, Container, Typography} from "@mui/material";

// etc
import dayjs from "dayjs";




/**
 * Journey 정보를 보여주는 컴포넌트
 * @param {Journey} journey
 */
export default function JourneyPill({travelId, journey}) {

    const [isJourneyViewState, setIsJourneyViewState] = useState(false);

    const journeyPhotoCnt = journey.photos.length;
    const journeyDate = dayjs(journey.date).format("YYYY년 MM월 DD일");

    const photoId = representPhotoIdOfJourney(journey);

    function onJourneyViewClick() {
        setIsJourneyViewState(true);
    }


    return (
        <>
            <Container
                maxWidth="sm"
                className={style.root_container}
                onClick={onJourneyViewClick}
            >
                <Box className={style.preview_box}>
                    <div className={style.preview}>
                        {
                            photoId !== null ?
                                <RepresentImage photoId={photoId}></RepresentImage>
                                :
                                <Typography color="textSecondary">
                                    사진 없음
                                </Typography>
                        }
                    </div>
                    <div className={style.journey_info}>
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
                            <div key={index} className={style.journey_tags}>{tag}</div>
                        )
                    )
                }
            </Container>

            {
                // 여정(Journey)목록 리스트 패널
                isJourneyViewState && <JourneyView travelId={travelId} journey={journey} viewCancel={() => setIsJourneyViewState(false)}/>
            }
        </>
    );
}