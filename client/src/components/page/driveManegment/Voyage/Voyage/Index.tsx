import pather from "path";
import * as React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

import { LinearProgress, Typography } from "@material-ui/core";

import { useVoyageQuery } from "../../../../../generated/graphql";
import ErrorPage from "../../../../ErrorPage";
import VoyageTimePage from "../VoyageTime/Index";

interface RouteParams {
  voyageId: string;
}

export default function VoyagePage() {
  const { voyageId } = useParams<RouteParams>();
  const { path } = useRouteMatch();
  const { data, loading, error } = useVoyageQuery({
    variables: { voyageId },
    onError: () => {},
  });
  if (loading) return <LinearProgress />;
  if (error) return <ErrorPage />;
  return (
    <div>
      {data && (
        <>
          <Typography variant="h4">{data.voyage.title}</Typography>
          <Switch>
            <Route exact path={pather.join(path, ":timeId")}>
              <VoyageTimePage
                institutionId={data.voyage.institutionId}
                school={data.voyage.school}
              />
            </Route>
          </Switch>
        </>
      )}
    </div>
  );
}
