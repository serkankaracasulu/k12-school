import * as React from "react";

import DialogWrapper from "../../../../DialogW";
import StudentList from "./StudentsList";

type PropsType = {
  setOpen(): void;
  institutionId: string;
  studentIds: string[];
  voyageId: string;
};

export default function StudentItem(props: PropsType) {
  const { studentIds, institutionId, setOpen, voyageId } = props;
  return (
    <DialogWrapper title="Öğrenciler" setOpen={setOpen}>
      <StudentList
        studentIds={studentIds}
        institutionId={institutionId}
        voyageId={voyageId}
      />
    </DialogWrapper>
  );
}
