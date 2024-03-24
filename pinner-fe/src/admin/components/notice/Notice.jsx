import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";
import {Navigate, useNavigate} from "react-router-dom";
import {Link as ReactRouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';

// component

// mui
import {Box, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/joy/Button";

// css
import style from './Notice.module.css';
import {Table} from "@mantine/core";

export default function Notice() {
    const apiv1 = useAPIv1();
    const navigate = useNavigate();

    const [pageNo, setPageNo] = useState(0); // 현재 페이지
    const [pageSize, setPageSize] = useState(5); // 페이지 사이즈
    const [totalPageCnt, setTotalPageCnt] = useState(0); // 전체 페이지 수

    const [noticeList, setNoticeList] = useState([]);

    useEffect(() => {
        getNoticeList();
    }, []);

    function getNoticeList() {
        const params = {page: pageNo, size: pageSize};
        apiv1.get("/admin/notice", {params})
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {
                    setNoticeList(response.data.noticeList);
                    setPageNo(response.data.PageNo);
                    setPageSize(response.data.pageSize);
                    setTotalPageCnt(response.data.totalPages);
                }
            })
            .catch((error) => {
                console.error({"getNoticeList-error": error});
            });
    }

    function writeNotice() {
        navigate("/admin/notice/write");
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.search}>

            </Paper>
            <Paper className={style.noticeList}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell align="right">제목</TableCell>
                                <TableCell align="right">조회수</TableCell>
                                <TableCell align="right">게시시작일</TableCell>
                                <TableCell align="right">게시종료일</TableCell>
                                <TableCell align="right">상태</TableCell>
                                <TableCell align="right">등록자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                noticeList.map((notice, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">{notice.id}</TableCell>
                                        <TableCell align="left"><Link component={ReactRouterLink} to={`/admin/notice/${notice.id}`}>{notice.title}</Link></TableCell>
                                        <TableCell align="left">{notice.viewCount}</TableCell>
                                        <TableCell align="left">{notice.startDate}</TableCell>
                                        <TableCell align="left">{notice.endDate}</TableCell>
                                        <TableCell align="left">{notice.status}</TableCell>
                                        <TableCell align="left">{notice.writer}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Button className={style.writeMoveBtn} onClick={writeNotice}>글쓰기</Button>
        </Box>
    //     https://mui.com/material-ui/react-pagination/
    );
}
