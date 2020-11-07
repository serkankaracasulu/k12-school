import * as React from "react";

import { List } from "@material-ui/core";

import {
  VoyageFragment,
  VoyageTimeFragment,
} from "../../../../../generated/graphql";
import TimeItem from "./TimeItem";

type PropsType = {
  times: VoyageTimeFragment[];
  voyage: VoyageFragment;
};

export default function VoyageTimes({ times, voyage }: PropsType) {
  return (
    <List>
      {times.map((time) => (
        <TimeItem time={time} key={time._id} voyage={voyage} />
      ))}
    </List>
  );
}
