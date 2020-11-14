import * as React from "react";
import { useParams } from "react-router-dom";

import { LinearProgress, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  useVoyageTimeQuery,
  VoyageFragment,
} from "../../../../../generated/graphql";
import days from "../../../../days";
import ErrorPage from "../../../../ErrorPage";
import DirectionMap from "../../DirectionMap";
import WatchPositionIconButton from "../../WatchPositionIcon";
import VoyageTimeStudentPage from "./Students/Index";

interface Params {
  voyageId: string;
  timeId: string;
}
type PropsType = {
  institutionId: string;
  school?: VoyageFragment["school"];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
      position: "relative",
      minHeight: 200,
    },
    fab: {
      position: "absolute",
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export default function VoyageTimePage({ institutionId, school }: PropsType) {
  const classes = useStyles();
  const { voyageId, timeId: voyageTimeId } = useParams<Params>();
  const { data, loading, error } = useVoyageTimeQuery({
    variables: { voyageId, voyageTimeId },
    onError: () => {},
  });
  if (loading) return <LinearProgress />;
  if (error) return <ErrorPage />;
  return (
    <div>
      {data && (
        <>
          <Typography variant="h5">
            {days[data.voyageTime.day]} {data.voyageTime.hour} {" - "}
            <Typography variant="subtitle1" component="span">
              {data.voyageTime.isTakeSchool
                ? "Evden okula seferi"
                : "Okuldan eve seferi"}
            </Typography>
          </Typography>
          <VoyageTimeStudentPage
            voyageTime={data.voyageTime}
            institutionId={institutionId}
            school={school}
          />
          <DirectionMap
            institutionId={institutionId}
            voyageTime={data.voyageTime}
            schoolLocation={{
              lat: school?.address?.coordinates[0] || 0,
              lng: school?.address?.coordinates[1] || 0,
            }}
          />
          <WatchPositionIconButton
            className={classes.fab}
            voyageId={voyageId}
            time={data.voyageTime}
          />
        </>
      )}
    </div>
  );
}
