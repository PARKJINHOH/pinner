import React from 'react';
import { Badge } from 'react-bootstrap';

import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

export default function JourneyPill({ journey, lineYn }) {
    const geoString = journey.geoLocationDto.name;
    const hashtags = journey.hashtags;

    return (
        <div>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot />
                        {lineYn ? <TimelineConnector /> : ''}
                    </TimelineSeparator>
                    <TimelineContent>
                        {geoString}
                        <Typography sx={{width: 170}}>{hashtags.map(tag => <Hashtag key={tag} tag={tag}></Hashtag>)}</Typography>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </div>
    )
}

function Hashtag({ tag }) {
    const style = {
        cursor: 'pointer',
    };

    return (
        <Badge  style={style} bg="light" text="dark">#{tag}</Badge>
    )
}   
