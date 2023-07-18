import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

// api
import { useAPIv1 } from '../../apis/apiv1';

// css
import style from './TravelPill.module.css';

// component
import { newJourneyStepState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyList from "./JourneyList";
import { googleMapState } from '../../states/map';
import { centerOfPoints } from '../../utils';
import { representPhotoIdOfTravel } from '../../common/travelutils';
import RepresentImage from './RepresentImage';

// mui
import { Box, Chip, Typography } from '@mui/material';

// etc
import toast from 'react-hot-toast';


/**
 * 여행 목록(Travel List)에서의 여행(Travel) 컴포넌트
 * @param travel
 */
// Todo : 클릭시 맵 중앙으로, centerOfPoints 구현
export default function TravelPill({ travel }) {
    const apiv1 = useAPIv1();

    const [isRenaming, setIsRenaming] = useState(false);

    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);

    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);
    const isSelected = travel.id === selectedId;

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

    const journeyCnt = travel.journeys.length;
    const journeyPhotoCnt = journeyList.reduce((acc, v) => v.photos.length + acc, 0);

    function onJourneyClick() {
        if (selectedTravelId === travel.id) {
            setSelectedTravelId('');
            return;
        }
        setSelectedTravelId(travel.id);
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

    const renameTextInput = <input type="text" autoFocus={true} onKeyDown={onKeyDownRename} onBlur={() => setIsRenaming(false)}></input>;

    const travelTitle =
        <Box sx={{ marginLeft: '10px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {travel.title}
            </Typography>
        </Box>;

    const photoId = representPhotoIdOfTravel(travel);

    return (
        <>
            <Box
                className={style.root_box}
                onClick={onJourneyClick}
            >
                {/* image */}
                <Box className={style.travel_box}>
                    {
                        photoId !== null ?
                            <RepresentImage photoId={photoId} />
                            :
                            <Typography color="textSecondary">
                                사진 없음
                            </Typography>
                    }
                    <div className={style.travel_info}>
                        <Chip size="small" sx={{ backgroundColor: '#5b5b5b', color: 'white' }}
                            label={`${journeyCnt} 장소`}
                        />
                        <Chip size="small" sx={{ backgroundColor: '#5b5b5b', color: 'white' }}
                            label={`${journeyPhotoCnt} 이미지`}
                        />
                    </div>
                </Box>

                {/* title */}
                {isRenaming ? renameTextInput : travelTitle}
            </Box>

            {
                /* 여정(Journey)목록 리스트 패널 */
                selectedTravelId === travel.id && (
                    <JourneyList travel={travel} />
                )
            }
        </>
    )
}