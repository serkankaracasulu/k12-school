import * as pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import Department from "./Department/Index";
import Lessons from "./Lesson/Index";
import MainListItems from "./ListItems";
import SchoolsG from "./SchoolsG/Index";
import TeacherField from "./TeacherField/Index";
import University from "./University/Index";

export default function Dashboard() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={path}>
          <div />
        </Route>
        <Route path={pather.join(path, "lessons")}>
          <Lessons />
        </Route>
        <Route path={pather.join(path, "schools")}>
          <SchoolsG />
        </Route>
        <Route path={pather.join(path, "departments")}>
          <Department />
        </Route>
        <Route path={pather.join(path, "teacherfields")}>
          <TeacherField />
        </Route>
        <Route path={pather.join(path, "universities")}>
          <University />
        </Route>
      </Switch>
    </MainContainer>
  );
}
