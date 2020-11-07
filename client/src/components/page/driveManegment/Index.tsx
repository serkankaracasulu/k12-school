import pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import { MainListItems } from "./ListItems";
import Request from "./Request/Index";
import Voyage from "./Voyage/Index";

export default function Dashboard() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={MainListItems}>
      <Switch>
        <Route exact path={path}>
          <div />
        </Route>
        <Route path={pather.join(path, "request")}>
          <Request />
        </Route>
        <Route path={pather.join(path, "voyage")}>
          <Voyage />
        </Route>
      </Switch>
    </MainContainer>
  );
}
