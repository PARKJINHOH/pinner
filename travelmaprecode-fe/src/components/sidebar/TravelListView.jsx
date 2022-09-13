import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useRecoilValue } from 'recoil'
import { isLoggedInState } from '../../states/traveler'
import NewTravelPill from './NewTravelPill'
import TravelPill from './TravelPill'

const dummyData = [
    {
        "id": 1,
        "orderKey": 1,
        "title": "2022년 강원도 여행",
        "journeys": [
            {
                "id": 1,
                "orderKey": 1,
                "date": "2022-08-14",
                "hashtags": [
                    "알파카월드",
                    "피자매장",
                    "그린티까페"
                ]
            },
            {
                "id": 3,
                "orderKey": 2,
                "date": "2022-08-15",
                "hashtags": [
                    "바베큐",
                    "팬션",
                    "초당순두부",
                    "두부아이스크림"
                ]
            },
            {
                "id": 2,
                "orderKey": 3,
                "date": "2022-08-16",
                "hashtags": [
                    "레일바이크"
                ]
            }
        ]
    },
    {
        "id": 2,
        "orderKey": 2,
        "title": "2023년 하루 여행",
        "journeys": [
            {
                "id": 1237,
                "orderKey": 1,
                "date": "2023-01-05",
                "hashtags": [
                    "제주공항",
                    "제주랜트",
                    "일출봉"
                ]
            }
        ]
    }
];

export default function TravelListView() {
    const isLoggedIn = useRecoilValue(isLoggedInState);

    const travelData = dummyData;

    const [isEdittingNewTravel, setIsEdittingNewTravel] = useState(false);

    return (
        <ul id='sidebar-list-div' className="flex-column mb-auto list-unstyled ps-0">
            {
                isLoggedIn ?
                    <>
                        <Button className='mb-3' onClick={(e) => setIsEdittingNewTravel(!isEdittingNewTravel)}>
                            새로운 여행
                        </Button>
                        {
                            isEdittingNewTravel && <NewTravelPill onCancle={() => setIsEdittingNewTravel(false)} />
                        }

                        {
                            travelData ?
                                travelData.map(t => <TravelPill key={t.id} travel={t} />)
                                :
                                <strong className='text-center fw-bold text-secondary'>
                                    Add your first travel.
                                </strong>
                        }
                    </>
                    :
                    <strong className='text-center fw-bold text-secondary'>
                        Join us and start your travel ✈
                    </strong>
            }
        </ul>
    )
}
