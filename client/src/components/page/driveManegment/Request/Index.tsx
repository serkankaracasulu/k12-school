import * as React from "react";

import { LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useDriverServiceRequestsQuery } from "../../../../generated/graphql";
import ErrorPage from "../../../ErrorPage";
import RequestCard from "./RequestCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3, 1, 3, 1),
      position: "relative",
    },
  })
);

export default function DriverManegmentRequest() {
  const classes = useStyles();
  const { data, loading, error } = useDriverServiceRequestsQuery({
    onError: () => {},
  });
  if (loading) return <LinearProgress />;
  if (error) return <ErrorPage />;
  return (
    <div className={classes.container}>
      {data &&
        data.driverServiceRequests.map((app) => (
          <RequestCard application={app} key={app._id} />
        ))}
    </div>
  );
}
