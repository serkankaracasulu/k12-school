import * as React from "react";

import { StudyFragment } from "../../generated/graphql";
import DialogWrapper from "../DialogW";
import RequestItem from "./StudyRequestItem";
import { IStudyStudent } from "./type";

type PropsType = {
  study: StudyFragment;
  request: StudyFragment["students"];
  setOpen(): void;
};

export default function StudyRequest(props: PropsType) {
  const { study, setOpen, request } = props;

  return (
    <DialogWrapper title={study.subject} setOpen={setOpen}>
      {request.map(
        (student) =>
          student.student && (
            <RequestItem
              key={student._id}
              studyStudent={student as IStudyStudent}
              studyId={study._id}
            />
          )
      )}
    </DialogWrapper>
  );
}
