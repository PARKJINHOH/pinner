import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useAPIv1 } from '../../apis/apiv1';
import { travelState } from '../../states/travel';

export default function NewTravelPill({ onCancle }) {
    const [title, setTitle] = useState("");

    const [travels, setTravels] = useRecoilState(travelState);

    const apiv1 = useAPIv1();


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

                const data = await apiv1.post("/travel", { title }).data;
                setTravels([...travels, data]);
                console.log(data);
            }
            onCancle();
        }
    }

    return (
        <input type="text" className='mb-2' autoFocus={true} onChange={e => setTitle(e.target.value)} value={title} onKeyDown={onKeyDownRename} onBlur={onCancle}></input>
    )
}
