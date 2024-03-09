import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";

// component

// mui
import {Box} from "@mui/material";
import IconButton from '@mui/joy/IconButton';
import Typography from "@mui/joy/Typography";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CampaignIcon from '@mui/icons-material/Campaign';

// recharts
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

// css
import style from './Dashboard.module.css';

export default function Dashboard() {
    const apiv1 = useAPIv1();

    const [totalTraveler, setTotalTraveler] = useState(0);
    const [activeTraveler, setActiveTraveler] = useState(0);
    const [inactiveTraveler, setInactiveTraveler] = useState(0);
    const [totalTravel, setTotalTravel] = useState(0);
    const [travelerGroupByYearMonthList , setTravelerGroupByYearMonthList] = useState([]);

    useEffect(() => {
        getTotalTraveler();
    }, []);

    function getTotalTraveler() {
        apiv1.post("/admin/dashboard/summary", {})
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {
                    setTotalTraveler(response.data.totalTraveler);
                    setActiveTraveler(response.data.activeTraveler);
                    setInactiveTraveler(response.data.inactiveTraveler);
                    setTotalTravel(response.data.totalTravel);
                    setTravelerGroupByYearMonthList(response.data.travelerGroupByYearMonthList);
                }
            })
            .catch((error) => {
                console.error({"getTotalTraveler-error": error.response.data.message});
            });
    }

    return (
        <Box>
            <Box className={style.container_top}>
                <div className={style.container_top_left}>
                    <Box className={style.summary_1}>
                        <Box className={style.summary_traveler}>
                            <Typography></Typography>
                            <Typography level="h1" sx={{color: '#ffffff'}}>{totalTraveler}명({activeTraveler}/<Typography sx={{color: '#ff8080'}}>{inactiveTraveler}</Typography>)</Typography>
                            <Typography level="title-md" sx={{color: '#b39ddb'}}>Traveler (active,inactive)</Typography>
                        </Box>
                    </Box>
                    <Box className={style.summary_1}>
                        <Box className={style.summary_traveler}>
                            <Typography></Typography>
                            <Typography level="h1" sx={{color: '#ffffff'}}>{totalTravel}여정</Typography>
                            <Typography level="title-md" sx={{color: '#b39ddb'}}>Total Travel</Typography>
                        </Box>
                    </Box>
                </div>
                <div className={style.container_top_right}>
                    <Box className={style.summary_2}>
                        <Box className={style.problem_cnt}>
                            <IconButton variant="outlined" sx={{backgroundColor: '#1565c0'}}>
                                <WarningAmberOutlinedIcon sx={{color: 'white'}}/>
                            </IconButton>
                            <Box sx={{marginLeft: '15px'}}>
                                <Typography level="title-lg" sx={{color: '#ffffff'}}>9999개</Typography>
                                <Typography level="body-xs" sx={{color: '#ffffff'}}>문의갯수</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={style.summary_2}>
                        <Box className={style.problem_cnt}>
                            <IconButton variant="outlined" sx={{backgroundColor: '#1565c0'}}>
                                <CampaignIcon sx={{color: 'white'}}/>
                            </IconButton>
                            <Box sx={{marginLeft: '15px'}}>
                                <Typography level="title-lg" sx={{color: '#ffffff'}}>99개</Typography>
                                <Typography level="body-xs" sx={{color: '#ffffff'}}>현재 공지사항</Typography>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </Box>

            <Box className={style.container_middle}>
                <Typography level="h3" sx={{color: '#000000', marginLeft: '20px', paddingTop: '10px'}}>Traveler 회원추이(1년)</Typography>
                <ResponsiveContainer className={style.container_charts_container}>
                    <AreaChart
                        data={travelerGroupByYearMonthList}
                        margin={{top: 50, right: 60, left: 0, bottom: 0,}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Area type="monotone" dataKey="traveler" stroke="#8884d8" fill="#8884d8"/>
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}
