import * as React from "react";
import { Route, Switch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import { RouterCons } from "../../Routers";
import Absence from "./Absence/Index";
import Calender from "./CalenderTeacher";
import Lessons from "./Lessons/Index";
import { MainListItems } from "./ListItems";
import Study from "./Study/index";

export default function Dashboard() {
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={RouterCons.teacher.base}>
          <div>teacher</div>
        </Route>
        <Route path={RouterCons.teacher.calender.fullpath}>
          <Calender />
        </Route>
        <Route path={RouterCons.teacher.lessons.fullpath}>
          <Lessons />
        </Route>
        <Route path={RouterCons.teacher.absence.fullpath}>
          <Absence />
        </Route>
        <Route path={RouterCons.teacher.study.fullpath}>
          <Study />
        </Route>
      </Switch>
    </MainContainer>
  );
}
