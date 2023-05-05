import React, {useState} from 'react';
import {useRecoilState} from 'recoil';
import {useAPIv1} from '../../apis/apiv1';
import {travelState} from '../../states/travel';
import {Button, TextField} from "@mui/material";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import {AuthModalVisibility} from "../../states/modal";
import LoginIcon from "@mui/icons-material/Login";
import Stack from "@mui/material/Stack";

export default function NewTravelPill({onCancle}) {
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
                const resp = await apiv1.post("/travel", {title});
                const travel = resp.data;
                setTravels([...travels, travel]);
            }
            onCancle();
        }
    }

    return (
        <>
            <TextField
                sx={{mx: '10px', marginTop: '5px'}}
                id="outlined-multiline-flexible"
                label="여행제목을 적어주세요(10자)"
                inputProps={{maxLength: 10}}
                multiline
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={onKeyDownRename}
            />
            <Stack
                sx={{ mx: '10px', marginTop: '5px'}}
                spacing={2} direction="row"
            >
                <Button
                    sx={{ flex: 1 }}
                    color="error"
                    variant="contained"
                    onClick={onCancle}
                >
                    취소
                </Button>
                <Button
                    sx={{ flex: 1 }}
                    variant="contained"
                    onClick={onKeyDownRename}
                >
                    확인
                </Button>
            </Stack>

        </>

    )
}
