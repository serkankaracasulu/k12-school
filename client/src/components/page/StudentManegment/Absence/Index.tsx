import { DateTime } from "luxon";
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Container,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  AbsenceFragment,
  useAbsencesQuery,
} from "../../../../generated/graphql";
import Context from "../../../Context";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        padding: 0,
      },
    },
    list: {
      flexWrap: "wrap",
      display: "flex",
    },
    listItem: {
      maxWidth: "250px",
    },
    active: {
      backgroundColor: theme.palette.action.selected,
    },
  })
);

type ParamType = {
  absenceId: string;
};

export default function AbsenceList() {
  const classes = useStyles();
  const { absenceId } = useParams<ParamType>();
  const { studentIndex } = React.useContext(Context);
  const [absenceArrays, setAbsenceArrays] = React.useState<AbsenceFragment[][]>(
    []
  );
  const { data, refetch } = useAbsencesQuery({
    variables: { t: true, parentStudentId: studentIndex },
    onCompleted: (tData) => {
      const { absences } = tData;
      generateAbsenceList(absences);
    },
    fetchPolicy: absenceId ? "network-only" : "cache-first",
  });
  React.useEffect(() => {
    if (absenceId && data) {
      const isTargetExist = data.absences.find(
        (absenceValue) => absenceValue._id === absenceId
      );
      if (!isTargetExist) {
        refetch({ t: true }).then((result) => {
          if (result && result.data) {
            generateAbsenceList(result.data.absences);
          }
        });
      }
    }
  }, [absenceId, data, refetch]);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <List
        className={classes.list}
        subheader={
          <ListSubheader component="div" style={{ width: "100%" }}>
            Dönem içi Devamsızlık
          </ListSubheader>
        }
      >
        {absenceArrays.map((absenceArrayValue, index) => {
          const [absence] = absenceArrayValue;
          if (absence) {
            const date = DateTime.fromISO(absence.date.toString()).toUTC();
            const hours = absenceArrayValue
              .map((value) => value.hourCode)
              .join(",");
            const isTargetExist =
              absenceId &&
              !!absenceArrayValue.find(
                (absenceValue) => absenceValue._id === absenceId
              );
            const absenceItem = (
              <ListItem key={absence._id} className={classes.listItem}>
                <ListItemText
                  primary={date.setLocale("tr").toFormat("d LLL yy cccc")}
                  secondary={`${hours}. saat`}
                />
              </ListItem>
            );
            if (isTargetExist)
              return (
                <Grow in={true} timeout={1000} key={absence._id}>
                  {absenceItem}
                </Grow>
              );
            return absenceItem;
          }
          return <span key={index} />;
        })}
      </List>
    </Container>
  );

  function generateAbsenceList(absenceList: AbsenceFragment[]) {
    const absenceArray: AbsenceFragment[][] = [];
    for (let index = 0; index < absenceList.length; index++) {
      const absence = absenceList[index];
      const absenceStart = DateTime.fromISO(absence.date.toString());
      const sameDayAbsences = absenceList.filter((absenceValue) =>
        absenceStart.hasSame(
          DateTime.fromISO(absenceValue.date.toString()),
          "day"
        )
      );
      index += sameDayAbsences.length - 1;
      absenceArray.push(sameDayAbsences);
    }
    setAbsenceArrays(absenceArray);
  }
}
