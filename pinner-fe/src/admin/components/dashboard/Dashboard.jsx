import React from 'react';

// component

// mui
import {Box} from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Typography from "@mui/joy/Typography";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CampaignIcon from '@mui/icons-material/Campaign';

// css
import style from './Dashboard.module.css';

import {SvgIcon} from "@mui/joy";
import Button from "@mui/joy/Button";


export default function Dashboard() {

    return (
        <Box>
            <Box className={style.container_top}>
                <div className={style.container_top_left}>
                    <Box className={style.summary_1}>
                        <Box className={style.summary_traveler}>
                            <Typography></Typography>
                            <Typography level="h1" sx={{color: '#ffffff'}}>100명</Typography>
                            <Typography level="title-md" sx={{color: '#b39ddb'}}>Total Traveler</Typography>
                        </Box>
                    </Box>
                    <Box className={style.summary_1}>
                        <Box className={style.summary_traveler}>
                            <Typography></Typography>
                            <Typography level="h1" sx={{color: '#ffffff'}}>21398개</Typography>
                            <Typography level="title-md" sx={{color: '#b39ddb'}}>Total Travel</Typography>
                        </Box>
                    </Box>
                </div>
                <div className={style.container_top_right}>
                    <Box className={style.summary_2}>
                        <Box className={style.problem_cnt}>
                            <IconButton variant="outlined" sx={{backgroundColor: '#1565c0'}}>
                                <WarningAmberOutlinedIcon sx={{color:'white'}}/>
                            </IconButton>
                            <Box sx={{marginLeft:'15px'}}>
                                <Typography level="title-lg" sx={{color: '#ffffff'}}>12개</Typography>
                                <Typography level="body-xs" sx={{color: '#ffffff'}}>문의갯수</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={style.summary_2}>
                        <Box className={style.problem_cnt}>
                            <IconButton variant="outlined" sx={{backgroundColor: '#1565c0'}}>
                                <CampaignIcon sx={{color:'white'}}/>
                            </IconButton>
                            <Box sx={{marginLeft:'15px'}}>
                                <Typography level="title-lg" sx={{color: '#ffffff'}}>2개</Typography>
                                <Typography level="body-xs" sx={{color: '#ffffff'}}>현재 공지사항</Typography>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </Box>

            <Box className={style.container_middle}>
                <Box className={style.summary_3}>
                </Box>
            </Box>
        </Box>
    );
}
