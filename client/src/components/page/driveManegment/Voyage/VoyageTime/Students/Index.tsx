import * as React from "react";

import { Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";

import {
  VoyageFragment,
  VoyageTimeFragment,
} from "../../../../../../generated/graphql";
import SchoolVoyageInfoCardItem from "./SchoolCard";
import StudentVoyageInfoCardItem from "./StudentCard";

type PropTypes = {
  voyageTime: VoyageTimeFragment;
  institutionId: string;
  school?: VoyageFragment["school"];
};

export default function VoyageTimeStudentPage({
  voyageTime,
  institutionId,
  school,
}: PropTypes) {
  const SchoolComp = school && (
    <TimelineItem>
      <TimelineOppositeContent style={{ flex: 0.2, minWidth: 50 }}>
        <Typography color="textSecondary">Okul</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <SchoolVoyageInfoCardItem school={school} />
      </TimelineContent>
    </TimelineItem>
  );

  return (
    <Timeline>
      {!voyageTime.isTakeSchool && SchoolComp}
      {[...voyageTime.studentInfos]
        .sort((s) => (voyageTime.isTakeSchool ? -s.order : s.order))
        .map((studentInfo) => (
          <TimelineItem key={studentInfo._id}>
            <TimelineOppositeContent style={{ flex: 0.2, minWidth: 50 }}>
              <Typography color="textSecondary">{studentInfo.order}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <StudentVoyageInfoCardItem
                key={studentInfo._id}
                institutionId={institutionId}
                studentInfo={studentInfo}
              />
            </TimelineContent>
          </TimelineItem>
        ))}
      {voyageTime.isTakeSchool && SchoolComp}
    </Timeline>
  );
}
