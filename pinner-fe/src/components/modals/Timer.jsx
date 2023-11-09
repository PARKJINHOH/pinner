import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";

export function Timer() {
    const [seconds, setSeconds] = useState(180); // 3분을 초로 계산한 값

    useEffect(() => {
        let interval;
        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [seconds]);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <Typography variant="subtitle1" style={{display: 'flex', alignItems: 'center', marginRight: '10px'}}>{formatTime(seconds)}</Typography>
    );
};
