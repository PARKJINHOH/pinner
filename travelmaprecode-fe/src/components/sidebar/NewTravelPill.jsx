import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useAPIv1 } from '../../apis/apiv1';
import { travelState } from '../../states/travel';
import {TextField} from "@mui/material";

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

                const resp = await apiv1.post("/travel", { title });
                const travel = resp.data;
                setTravels([...travels, travel]);
            }
            onCancle();
        }
    }

    return (
        <TextField
            sx={{
                mx: 'auto',
                p: 1,
                m: 1,
                textAlign: 'center',
                fontSize: '0.875rem',
            }}
            inputProps={{maxLength: 10}}
            variant="outlined"
            label="여행제목을 적어주세요(10자)"
            type="text"
            autoFocus={true}
            onChange={e => setTitle(e.target.value)}
            value={title}
            onKeyDown={onKeyDownRename}
            onBlur={onCancle}
        />
    )
}
