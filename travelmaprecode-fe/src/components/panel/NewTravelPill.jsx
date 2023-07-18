import React, {useState} from 'react';
import {useRecoilState} from 'recoil';

// api
import {useAPIv1} from '../../apis/apiv1';

// component
import {travelState} from '../../states/travel';

// mui
import Stack from "@mui/material/Stack";
import {Button, TextField} from "@mui/material";

/**
 * 'Click to add new Travel'클릭시 나오는 컴포넌트
 * @param onCancel
 */
export default function NewTravelPill({onCancel}) {
    const apiv1 = useAPIv1();
    const [title, setTitle] = useState("");
    const [travels, setTravels] = useRecoilState(travelState);


    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
     */
    async function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";
        const isMouseClick = e.type === "click";

        if (isEsc || isEnter || isMouseClick) {
            e.preventDefault();
            if (isEnter || isMouseClick) {
                const resp = await apiv1.post("/travel", {title});
                const travel = resp.data;
                setTravels([...travels, travel]);
            }
            onCancel();
        }
    }

    return (
        <>
            <TextField
                sx={{mx: '10px', marginTop: '5px'}}
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
                    onClick={onCancel}
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
