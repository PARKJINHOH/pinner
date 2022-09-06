import React from 'react'
import { Button } from 'react-bootstrap'
import { useRecoilValue } from 'recoil'
import { isLoggedInState } from '../../states/traveler'
import TravelPill from './TravelPill'

const dummyData = [
    {
        id: 123,
        title: "2022년 유럽여행",
        travels: [
            {
                id: 1234,
                title: "영국 1일차 런던"
            },
            {
                id: 1235,
                title: '영국 2일차 세븐 시스터',
            },
            {
                id: 1236,
                title: '영국 3일차 옥스포드',
            },
        ],
    },

    {
        id: 124,
        title: "2013년 일본 여행",
        travels: [
            {
                id: 1244,
                title: "오사카"
            },
            {
                id: 1245,
                title: '교토',
            },
            {
                id: 1246,
                title: '우지 녹차마을',
            },
        ],
    },
];

export default function TravelListView() {
    const isLoggedIn = useRecoilValue(isLoggedInState);

    const travelData = dummyData;

    return (
        <ul id='sidebar-list-div' className="flex-column mb-auto list-unstyled ps-0">
            {
                isLoggedIn ?
                    <>
                        <Button className='mb-3'>
                            새로운 여행
                        </Button>
                        {
                            travelData ?
                                travelData.map(t => <TravelPill travelLog={t} />)
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
