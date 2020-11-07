import * as React from "react";

import { StudyFragment } from "../../generated/graphql";
import DialogWrapper from "../DialogW";
import StudyItem from "./StudyItem";

type PropsType = {
  setOpen(): void;
  study: StudyFragment;
  week: number;
};
export default function StudyItemContainer(props: PropsType) {
  const { setOpen, study, week } = props;
  return (
    <DialogWrapper title="Etüt" setOpen={setOpen}>
      <StudyItem study={study} week={week} queryVariables={{ week }} />
    </DialogWrapper>
  );
}
