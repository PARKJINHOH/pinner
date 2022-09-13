import React, { useState } from 'react';

export default function NewTravelPill({onCancle}) {
    const [title, setTitle] = useState("");

    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
     */
    function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";

        if (isEsc || isEnter) {
            e.preventDefault();
            if (isEnter) {
                // TODO: apply rename
                console.log("create new travel");
            }
            onCancle();
        }
    }

    return (
        <input type="text" className='mb-2' autoFocus={true} onChange={e => setTitle(e.target.value)} value={title} onKeyDown={onKeyDownRename} onBlur={onCancle}></input>
    )
}
