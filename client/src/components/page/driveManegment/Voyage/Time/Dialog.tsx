import * as React from "react";
import {
  VoyageFragment,
  VoyageTimeFragment,
} from "../../../../../generated/graphql";

import DialogWrapper from "../../../../DialogW";
import Times from "./Index";

type PropsType = {
  setOpen(): void;
  times: VoyageTimeFragment[];
  voyage: VoyageFragment;
};

export default function VoyageTimes({ setOpen, times, voyage }: PropsType) {
  return (
    <DialogWrapper title="Seferler" setOpen={setOpen}>
      <Times times={times} voyage={voyage} />
    </DialogWrapper>
  );
}
