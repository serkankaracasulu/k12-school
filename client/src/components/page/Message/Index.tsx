import pather from "path";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import MainContainer from "../../MainContainer";
import ListItems from "./ListItems";
import Messages from "./Messages";

export default function Message() {
  const { path } = useRouteMatch();
  return (
    <MainContainer ListItems={ListItems}>
      <Switch>
        <Route path={pather.join(path, ":inboxId")}>
          <Messages />
        </Route>
      </Switch>
    </MainContainer>
  );
}
