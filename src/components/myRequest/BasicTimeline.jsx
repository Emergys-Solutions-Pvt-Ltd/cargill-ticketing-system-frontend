import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Avatar, Box, Card, Typography } from "@mui/material";
import { timelineItemClasses } from "@mui/lab/TimelineItem";

export default function BasicTimeline() {
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
          <TimelineDot>
            <Avatar sx={{ width: 24, height: 24 }}>A</Avatar>
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Card sx={{ padding: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Ashish Shende</Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: "100" }}>
                4min ago. additional Comment
              </Typography>
            </Box>
            <Typography>
              REQ000123465 has been raised with security team to perform
              assesment
            </Typography>
          </Card>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot>
            <Avatar sx={{ width: 24, height: 24 }}>S</Avatar>
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <Card sx={{ padding: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Security Team</Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: "100" }}>
                4min ago. additional Comment
              </Typography>
            </Box>
            <Typography>
              REQ000123465 has been raised with security team to perform
              assesment
            </Typography>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
