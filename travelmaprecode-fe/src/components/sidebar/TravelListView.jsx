import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useRecoilValue } from 'recoil'
import { travelState } from '../../states/travel'
import { isLoggedInState } from '../../states/traveler'
import NewTravelPill from './NewTravelPill'
import TravelPill from './TravelPill'


export default function TravelListView() {
    const isLoggedIn = useRecoilValue(isLoggedInState);

    const travelData = useRecoilValue(travelState);

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
