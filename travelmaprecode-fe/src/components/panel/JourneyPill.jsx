import React from 'react';

import {Box, Container, Typography} from "@mui/material";
import './JourneyPill.css';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {travelState} from "../../states/travel";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";

/**
 * Journey 정보를 보여주는 컴포넌트
 * @param travel
 */
export default function JourneyPill({ journey }) {
    console.log('JourneyPill', journey);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const setTravels = useSetRecoilState(travelState);


    return (
        <>
            <Container maxWidth="sm" className="journeyPill-container">
                <Box className="journeyPill-list-box">
                    {journey.photos.length > 0 ? (
                        (() => {
                            return (
                                <img
                                    src={`/photo/${journey.photos[0]}`}
                                    loading="lazy"
                                    alt="photo"
                                    width="100%"
                                    height="100%"
                                />
                            );
                        })()
                    ) : (
                        <Typography align="center" color="textSecondary">
                            사진 없음
                        </Typography>
                    )}
                </Box>
                <Typography variant='h6'>{journey.geoLocationDto.name}</Typography>
                {
                    journey.hashtags.map((tag) => {
                        return (
                            <div className="journeyPill-tag">{tag}</div>
                        )
                    })
                }
            </Container>

            {/*{*/}
            {/*    여정(Journey)목록 리스트 패널 */}
            {/*selectedTravelId === travel.id && (*/}
            {/*    <JourneyList travel={travel}/>*/}
            {/*)*/}
            {/*}*/}
        </>
    );
}