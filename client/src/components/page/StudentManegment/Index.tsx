import * as pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import Absence from "./Absence/Index";
import Lessons from "./Lessons/Index";
import { MainListItems } from "./ListItems";
import Calender from "./Schedule/Index copy";
import SchoolVehicle from "./SchoolVehicle/Index";
import Study from "./Study/Index";

export default function StudentIndex() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={path}>
          <div>Göstergeler</div>
        </Route>
        <Route path={pather.join(path, "calendar")}>
          <Calender />
        </Route>
        <Route path={pather.join(path, "lessons")}>
          <Lessons />
        </Route>
        <Route path={pather.join(path, "absence", ":absenceId")}>
          <Absence />
        </Route>
        <Route path={pather.join(path, "absence")}>
          <Absence />
        </Route>
        <Route path={pather.join(path, "study")}>
          <Study />
        </Route>
        <Route path={pather.join(path, "schoolvehicle")}>
          <SchoolVehicle />
        </Route>
      </Switch>
    </MainContainer>
  );
}
