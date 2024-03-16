import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";

// component

// mui

// css
import style from './NoticeWrite.module.css';
import {Box, Paper} from "@mui/material";
import Button from "@mui/joy/Button";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/material/TextField";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function NoticeWrite() {
    const apiv1 = useAPIv1();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    function write() {
        console.log(title);
        console.log(content);
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.titlePaper}>
                <Typography level="h3" className={style.title} align="right">제목</Typography>
                <TextField sx={{width: '1320px'}}
                           value={title} onChange={(e) => setTitle(e.currentTarget.value)}
                />
            </Paper>
            <Paper className={style.textPaper}>
                <Typography level="h3" className={style.content} align="right">내용</Typography>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        placeholder: "내용을 입력하세요.",
                    }}
                    onReady={(editor) => {
                        // console.log( 'Editor is ready to use!', editor );
                    }}
                    onChange={(event, editor) => {
                        setContent(editor.getData());
                    }}
                    onBlur={(event, editor) => {
                        // console.log( 'Blur.', editor );
                    }}
                    onFocus={(event, editor) => {
                        // console.log( 'Focus.', editor );
                    }}
                />
            </Paper>
            <div className={style.controlArea}>
                <Button className={style.cancelBtn} onClick={() => navigate('/admin/notice', {replace: true})}>취소</Button>
                <Button className={style.writeBtn} onClick={write}>글쓰기</Button>
            </div>

        </Box>
    );
}