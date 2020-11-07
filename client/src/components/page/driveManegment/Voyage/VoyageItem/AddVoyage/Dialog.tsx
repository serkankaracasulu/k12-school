import * as React from "react";

import { DialogActions } from "@material-ui/core";

import DialogWrapper from "../../../../../DialogW";
import { VoyageTimeWithId } from "../../Create/type";
import VoyageItem from "../../Create/VoyageItem";
import AddButon from "./AddButton";

type PropsType = {
  setOpen(): void;
  voyageId: string;
};

export default function VoyageAdd({ setOpen, voyageId }: PropsType) {
  const [variables, setVariables] = React.useState<VoyageTimeWithId>({
    id: "new",
    hour: "08:00",
    day: 0,
    isTakeSchool: false,
  });
  const { id, ...rest } = variables;
  return (
    <DialogWrapper setOpen={setOpen} title="Sefer ekle">
      <VoyageItem set={setVariables} time={variables} />
      <DialogActions>
        <AddButon variables={{ ...rest, voyageId }} />
      </DialogActions>
    </DialogWrapper>
  );
}
