import clsx from "clsx";
import * as pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";

import { useSchoolsQuery } from "../../../../generated/graphql";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
import AddressPage from "./AdressPage";
import ClassPage from "./Classes/Index";
import CreateSchool from "./CreateSchool";
import SchoolItem from "./Schooltem";
import StudentsPage from "./Students/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
    button: {
      marginLeft: theme.spacing(1),
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    card: {
      maxWidth: 345,
      margin: theme.spacing(2),
      width: 250,
    },
    cardActions: {
      padding: theme.spacing(0),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      display: "flex",
      justifyContent: "flex-end",
    },
    cardContent: {
      display: "flex",
      justifyContent: "space-around",
    },
    cardPersonContent: {
      paddingBottom: theme.spacing(0),
    },
    center: {
      display: "flex",
      justifyContent: "",
    },
    fixed: {
      height: 240,
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
      fontSize: "7rem",
    },
    addCard: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardTitle: {
      textTransform: "capitalize",
    },
    avatar: {
      color: theme.palette.grey[600],
    },
  })
);

export function Index() {
  const { loading, data } = useSchoolsQuery();
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const [isCreate, setIsCreate] = React.useState<boolean>(false);
  const CreateSchoolForm = () => {
    const schools = data ? data.schools : [];
    return (
      <CreateSchool
        schools={schools}
        isActive={() => setIsCreate(false)}
        setSnackBarProp={setSnackBarProp}
      />
    );
  };
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container justify="flex-start" spacing={3}>
        <Card className={clsx(classes.addCard, classes.card)}>
          <CardContent>
            {isCreate === false ? (
              <IconButton
                aria-label="add school"
                onClick={() => setIsCreate(true)}
              >
                <Add
                  fontSize="large"
                  className={classes.extendedIcon}
                  color="primary"
                />
              </IconButton>
            ) : (
              <CreateSchoolForm />
            )}
          </CardContent>
        </Card>

        {loading && (
          <Card className={classes.card}>
            <LinearProgress />
          </Card>
        )}
        {data &&
          data.schools &&
          data.schools.map((school) => (
            <SchoolItem school={school} key={school._id} />
          ))}
      </Grid>

      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </Container>
  );
}

export default function RoutePage() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={pather.join(path, ":schoolId", "students")}>
        <StudentsPage />
      </Route>
      <Route path={pather.join(path, ":schoolId", "classes")}>
        <ClassPage />
      </Route>
      <Route path={pather.join(path, ":schoolId", "address")}>
        <AddressPage />
      </Route>
    </Switch>
  );
}
