import clsx from "clsx";
import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { DriverStudentApplication } from "../../../../generated/graphql";
import SendMessageButton from "../../../SendMessageButton";
import StudentAvatar from "../../dashboard/StudentAvatar";
import AcceptButton from "./AcceptButton";
import CancelButton from "./CancelButton";

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
type PropsType = {
  application: DriverStudentApplication;
};
export default function RequestCard({ application }: PropsType) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          application.userId && (
            <StudentAvatar
              studentId={application.userId}
              instId={application.institutionId}
            />
          )
        }
        title={application.userFullName}
        subheader={application.createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {application.address?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <AcceptButton request={application} />
        <CancelButton request={application} />
        <SendMessageButton to={application.parentId} />
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
          {application.address && (
            <iframe
              title="Student address"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg&q=${application.address.location.coordinates[0]},${application.address.location.coordinates[1]}&zoom=15`}
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
