/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useLocationTrack } from "google-map-hooks";
import * as React from "react";

import { Fab, Tooltip } from "@material-ui/core";
import { PlayArrow, Stop } from "@material-ui/icons";

import {
  useStartPositionMutation,
  useStopPositionMutation,
  useUpdatePositionMutation,
  VoyageTimeFragment,
} from "../../../generated/graphql";

interface IWatchPositionIconButtonProps {
  className?: string;
  voyageId: string;
  time: VoyageTimeFragment;
}

const WatchPositionIconButton: React.FunctionComponent<IWatchPositionIconButtonProps> = ({
  className,
  voyageId,
  time,
}) => {
  const [start] = useStartPositionMutation({
    onError: () => {},
  });
  const [update] = useUpdatePositionMutation({
    onError: () => {},
  });
  const [stop] = useStopPositionMutation({
    onError: () => {},
  });
  const { position } = useLocationTrack();
  React.useEffect(() => {
    if (!position || !time.sessionId || !time.isStart) return;
    const { coords, timestamp } = position;
    const {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed,
    } = coords;
    update({
      variables: {
        position: {
          coords: {
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            latitude,
            longitude,
            speed,
          },
          timestamp,
        },
        voyageId,
        timeId: time._id,
        sessionId: time.sessionId,
      },
    });
  }, [position]);
  const handleStartStop = () => {
    if (time.isStart) {
      stop({ variables: { timeId: time._id, voyageId } });
    } else if (position) {
      const { coords, timestamp } = position;
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      } = coords;
      start({
        variables: {
          position: {
            coords: {
              accuracy,
              altitude,
              altitudeAccuracy,
              heading,
              latitude,
              longitude,
              speed,
            },
            timestamp,
          },
          voyageId,
          timeId: time._id,
        },
      });
    }
  };
  return (
    <Tooltip title={time.isStart ? "Seferi Durdur" : "Serferi Başlat"}>
      <Fab className={className} onClick={handleStartStop}>
        {time.isStart ? <Stop /> : <PlayArrow />}
      </Fab>
    </Tooltip>
  );
};

export default WatchPositionIconButton;
