import * as pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import Contact from "./Contact/Index";
import EducationPage from "./Education/Index";
import { MainListItems } from "./ListItems";

export default function Profile() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={path}>
          <div />
        </Route>
        <Route path={pather.join(path, "education")}>
          <EducationPage />
        </Route>
        <Route path={pather.join(path, "contact")}>
          <Contact />
        </Route>
      </Switch>
    </MainContainer>
  );
}
