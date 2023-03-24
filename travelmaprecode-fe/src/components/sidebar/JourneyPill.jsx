import React from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

export default function JourneyPill({ journey, lineYn }) {
    const geoString = journey.geoLocationDto.name;
    const hashtags = journey.hashtags;

    return (
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
                    <br />
                    <Typography component={'span'} sx={{ width: 170 }}>
                        {
                            hashtags.map(tag => <Chip key={tag} size="small" label={`#${tag}`} />)
                        }
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    )
}