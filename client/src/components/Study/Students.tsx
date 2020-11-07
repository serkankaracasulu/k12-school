import * as React from "react";

import { List } from "@material-ui/core";

import { StudyFragment } from "../../generated/graphql";
import DialogWrapper from "../DialogW";
import StudentItem from "./StudentItem";
import { IStudyStudent } from "./type";

type PropsType = {
  setOpen(): void;
  study: StudyFragment;
  students: IStudyStudent[];
};

export default function Students(props: PropsType) {
  const { setOpen, study, students } = props;
  return (
    <DialogWrapper setOpen={setOpen} title={study.subject}>
      <List>
        {students.map(
          (studentValue) =>
            studentValue.student && (
              <StudentItem
                key={studentValue._id}
                studyStudent={studentValue}
                studyId={study._id}
              />
            )
        )}
      </List>
    </DialogWrapper>
  );
}
