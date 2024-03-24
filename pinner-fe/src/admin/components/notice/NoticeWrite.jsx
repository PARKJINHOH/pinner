import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {useNavigate, useParams} from "react-router-dom";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// component

// mui
import {Box, Paper} from "@mui/material";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {Textarea} from "@mui/joy";

// css
import style from './NoticeWrite.module.css';

export default function NoticeWrite() {
    const apiv1 = useAPIv1();
    const navigate = useNavigate();
    const {idx} = useParams(); // useParams은 AuthRoutes의 path에 선언된 문자열 파라미터를 가져올 수 있음

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (idx !== undefined) {
            getNoticeDetail();
        }
    }, []);


    function onSubmit() {
        if (title.trim().length === 0 || content.trim().length === 0) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        if (idx !== undefined) {
            // 수정
            apiv1.patch("/admin/notice/" + idx, JSON.stringify({title: title.trim(), content: content, writer: window.sessionStorage.getItem("adminEmail")}))
                .then((response) => {
                    if (response.status === HTTPStatus.OK) {
                        if (response.data === true) {
                            navigate('/admin/notice', {replace: true});
                        } else {
                            alert("수정 실패");
                        }
                    }
                })
                .catch((error) => {
                    console.error({"notice-error": error});
                });
        } else {
            // 작성
            apiv1.post("/admin/notice", JSON.stringify({title: title.trim(), content: content, writer: window.sessionStorage.getItem("adminEmail")}))
                .then((response) => {
                    if (response.status === HTTPStatus.OK) {
                        if (response.data === true) {
                            navigate('/admin/notice', {replace: true});
                        } else {
                            alert("글쓰기 실패");
                        }
                    }
                })
                .catch((error) => {
                    console.error({"notice-error": error});
                });
        }


    }

    function getNoticeDetail() {
        apiv1.post("/admin/notice/" + idx)
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {
                    setTitle(response.data.title);
                    setContent(response.data.content);
                }
            })
            .catch((error) => {
                console.error({"getNoticeDetail-error": error});
            });
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.titlePaper}>
                <Typography level="h3" className={style.title} align="right">제목</Typography>
                <Textarea sx={{width: '70%'}} placeholder="제목을 입력해주세요."
                          value={title} onChange={(e) => setTitle(e.currentTarget.value)}
                />
            </Paper>
            <Paper className={style.textPaper}>
                <Typography level="h3" className={style.content} align="right">내용</Typography>
                <div className={style.ckeditor}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
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
                </div>

            </Paper>
            <div className={style.controlArea}>
                <Button className={style.cancelBtn} onClick={() => navigate('/admin/notice', {replace: true})}>취소</Button>
                {
                    idx !== undefined ?
                        <Button onClick={onSubmit}>수정</Button>
                        :
                        <Button onClick={onSubmit}>작성</Button>
                }
            </div>
        </Box>
    );
}