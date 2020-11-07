import clsx from "clsx";
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

import { StudentVoyegeInfoFragment } from "../../../../../../generated/graphql";
import SendMessageButton from "../../../../../SendMessageButton";
import StudentAvatar from "../../../../dashboard/StudentAvatar";
import ButtonSetLast from "./ButtonSetLast";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);
type PropTypes = {
  studentInfo: StudentVoyegeInfoFragment;
  institutionId: string;
};
type ParamTypes = {
  voyageId: string;
  timeId: string;
};
export default function StudentVoyageInfoCardItem({
  studentInfo,
  institutionId,
}: PropTypes) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { voyageId } = useParams<ParamTypes>();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!studentInfo.student)
    return (
      <Typography variant="overline" color="error">
        Öğrenci bulunamadı
      </Typography>
    );
  const { student } = studentInfo;
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <StudentAvatar studentId={student._id} instId={institutionId} />
        }
        title={student.fullName}
        subheader={
          <Typography variant="caption" color="textSecondary">
            {student.schoolName} - {student.className}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body2" color="secondary" component="p">
          {student.address?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {studentInfo.disabled && (
          <Tooltip title="Servis dışı">
            <NotInterestedIcon />
          </Tooltip>
        )}
        <ButtonSetLast variables={{ studentId: student._id, voyageId }} />
        <SendMessageButton to={student._id} />
        <Button
          aria-expanded={expanded}
          endIcon={<ExpandMoreIcon />}
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
        >
          {!expanded && "Haritada Gör"}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {student.address && (
            <iframe
              title="Student address"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg&q=${student.address.location.coordinates[0]},${student.address.location.coordinates[1]}&zoom=16`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: "0" }}
              allowFullScreen={false}
              aria-hidden="false"
              tabIndex={0}
            ></iframe>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
