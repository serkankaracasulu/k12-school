import * as pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import UserPage from "../User/Index";
import Chart from "./Chart";
import Drivers from "./Drivers/Index";
import { MainListItems } from "./ListItems";
import Schools from "./School/Index";
import StudentPage from "./Student/Index";
import Students from "./Students/Index";
import Teachers from "./Teachers/Index";

export default function Dashboard() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={path}>
          <Chart />
        </Route>
        <Route path={pather.join(path, "schools")}>
          <Schools />
        </Route>
        <Route exact path={pather.join(path, "user", ":userId")}>
          <UserPage />
        </Route>
        <Route path={pather.join(path, "student", ":studentId")}>
          <StudentPage />
        </Route>
        <Route path={pather.join(path, "teachers")}>
          <Teachers />
        </Route>
        <Route path={pather.join(path, "students")}>
          <Students />
        </Route>
        <Route path={pather.join(path, "drivers")}>
          <Drivers />
        </Route>
      </Switch>
    </MainContainer>
  );
}
