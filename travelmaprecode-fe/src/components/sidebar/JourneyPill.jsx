import React from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import {Box, List} from "@mui/material";

export default function JourneyPill({ journey }) {
    console.log('journey', journey);

    return (
        <List className='journey-list-div'>
            <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
                {/*<img src={journey.image} alt={journey.title} width="100%"/>*/}
            </Box>
        </List>
    )
}