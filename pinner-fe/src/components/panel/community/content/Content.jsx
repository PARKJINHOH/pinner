import React, {useState} from 'react'
import style from "./Content.module.css";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";

export default function Content() {


    return (
        <div className={style.wrap}>
            <div className={style.body}>
                <div className={style.box_row}>
                    {/*공지사항*/}
                    <div className={`${style.box_basic} ${style.notice}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>공지사항</Typography>
                        <Divider/>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>관리자</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.06.04</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">v1.2.1 업데이트 소식!</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>관리자</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.05.04</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">v1.2.0 업데이트 소식!</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>관리자</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.04</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">v1.1.9 업데이트 소식!</Typography>
                        </div>
                    </div>

                    {/*추천여행지*/}
                    <div className={`${style.box_basic} ${style.travel}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>추천 여행지</Typography>
                        <Divider/>
                    </div>
                </div>
                <div className={style.box_row}>
                    {/*커뮤니티*/}
                    <div className={`${style.box_basic} ${style.community}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>커뮤니티</Typography>
                        <Divider/>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>율리시스SS</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.24</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">일본여행 갔다 왔는데 여기 맛있더라궁! 오사카 스시집 추천하는 곳입니다.</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>판저크루투</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.23</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">여행 커뮤니티가 생겨서 너무 좋아요!</Typography>
                        </div>
                    </div>

                    {/*Q&A*/}
                    <div className={`${style.box_basic} ${style.qna}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>Q&A</Typography>
                        <Divider/>
                    </div>
                </div>
            </div>
        </div>
    );
}