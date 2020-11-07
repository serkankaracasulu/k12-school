import pather from "path";
import * as React from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { Button, Container, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { Person, useMyChildrenQuery } from "../../../../generated/graphql";
import Context from "../../../Context";
import UserMapEdit from "../../../UserAddress/Index";
import SchoolDrivers from "./Drivers";
import MyDrivers from "./DriversOfStudent";
import StudentVoyagesPage from "./Voyages";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      },
    },
    link: {
      marginLeft: theme.spacing(2),
    },
  })
);

export function SchoolVehicleIndex() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const { studentIndex } = React.useContext(Context);
  const [student, setStudent] = React.useState<Person>();
  useMyChildrenQuery({
    onCompleted: (tData) => {
      const fStudent = tData.myChildren.find((s) => s._id === studentIndex);
      fStudent && setStudent(fStudent);
    },
  });
  const [editAddress, setEditAddress] = React.useState(false);
  if (!student) return <span />;
  return (
    <Container maxWidth="lg" className={classes.container}>
      {!student.address || editAddress ? (
        <>
          <Typography color="error">
            İşlem yapmadan önce {student.fullName} adlı öğrencinin adres
            bilgilerini güncellemeniz gerekiyor
          </Typography>
          <UserMapEdit />
        </>
      ) : (
        <>
          <Button onClick={() => setEditAddress(true)}>Adres Düzenle</Button>
          <Link
            component={RouterLink}
            to={pather.join(url, "mydrivers")}
            className={classes.link}
          >
            Anlaştığım servis sürücüleri
          </Link>
          <Link
            component={RouterLink}
            to={pather.join(url, "find")}
            className={classes.link}
          >
            Okul servisi sürücüsü bul
          </Link>
        </>
      )}
      <StudentVoyagesPage />
    </Container>
  );
}
export default function StudentDriverRouter() {
  const classes = useStyles();
  const { studentIndex } = React.useContext(Context);
  const { path } = useRouteMatch();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Switch>
        <Route exact path={path}>
          <SchoolVehicleIndex />
        </Route>
        <Route path={pather.join(path, "find")}>
          {studentIndex && <SchoolDrivers i={studentIndex} />}
        </Route>
        <Route path={pather.join(path, "mydrivers")}>
          <MyDrivers />
        </Route>
      </Switch>
    </Container>
  );
}
