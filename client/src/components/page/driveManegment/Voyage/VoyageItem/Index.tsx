import * as React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Add as AddIcon } from "@material-ui/icons";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { VoyageFragment } from "../../../../../generated/graphql";
import getUserToken from "../../../../../helper/getUserToken";
import { isAuthenticationDriverforVoyage } from "../../Auth";
import AddStudent from "../AddStudent/Index";
import StudentList from "../Student/Dialog";
import Times from "../Time/Dialog";
import AddVoyage from "./AddVoyage/Dialog";

type PropsType = {
  voyage: VoyageFragment;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    container: {
      margin: theme.spacing(1),
    },
  })
);
export default function VoyageCardItem({ voyage }: PropsType) {
  const token = getUserToken();
  const [openAddStudent, setOpenAddStudent] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);
  const [openAddVoyage, setopenAddVoyage] = React.useState(false);
  const [openTime, setOpenTime] = React.useState(false);
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<AirportShuttleIcon color="primary" />}
        title={voyage.institutionName}
        subheader={voyage.title}
      />
      <CardContent>
        <Grid
          container
          spacing={1}
          className={classes.container}
          justify="center"
        >
          <Grid item>
            <Typography align="center" variant="body2">
              Öğrenci sayısı
            </Typography>
            <Button onClick={() => setOpenStudent(true)}>
              {voyage.studentIds.length}
            </Button>
            <Typography align="center" variant="h6"></Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          className={classes.container}
          justify="center"
        >
          <Grid item>
            <Typography align="center" variant="body2">
              Sefer sayısı
            </Typography>
            <Button onClick={() => setOpenTime(true)}>
              {voyage.voyageTimes.length}
            </Button>
          </Grid>
        </Grid>
        {isAuthenticationDriverforVoyage(voyage, token) && (
          <CardActions>
            <IconButton onClick={() => setOpenAddStudent(true)}>
              <PersonAddIcon />
            </IconButton>
            <Button
              onClick={() => setopenAddVoyage(true)}
              endIcon={<AddIcon />}
            >
              Sefer
            </Button>
          </CardActions>
        )}
      </CardContent>
      {openAddStudent && (
        <AddStudent
          institutionId={voyage.institutionId}
          setOpen={() => setOpenAddStudent(false)}
          voyageId={voyage._id}
        />
      )}
      {openTime && (
        <Times
          times={voyage.voyageTimes}
          setOpen={() => setOpenTime(false)}
          voyage={voyage}
        />
      )}
      {openAddVoyage && (
        <AddVoyage
          setOpen={() => setopenAddVoyage(false)}
          voyageId={voyage._id}
        />
      )}
      {openStudent && (
        <StudentList
          institutionId={voyage.institutionId}
          studentIds={voyage.studentIds}
          setOpen={() => setOpenStudent(false)}
          voyageId={voyage._id}
        />
      )}
    </Card>
  );
}
