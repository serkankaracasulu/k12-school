import * as React from "react";

import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";

import {
  AbsenceFragment,
  useStudentsQuery,
} from "../../../../generated/graphql";
import Context from "../../../Context";
import DialogWrapper from "../../../DialogW";
import StudentAvatar from "../../dashboard/StudentAvatar";
import { useDeleteAbsence } from "./mutate";

type PropsType = {
  setOpen(): void;
  absences: AbsenceFragment[];
  schoolId: string;
  classId: string;
};

export default function AbsenceDetail(props: PropsType) {
  const { setOpen, absences: absenceInital, schoolId, classId } = props;
  const [absences, setAbsences] = React.useState<AbsenceFragment[]>(
    absenceInital
  );
  const { data } = useStudentsQuery({
    variables: {
      studentIds: absences.map((value) => value.studentId),
      schoolId,
      classId,
    },
  });
  const { setPr } = React.useContext(Context);
  const deleteAbsence = useDeleteAbsence(setPr, setAbsences);
  const handleDelete = (studentId: string) => {
    if (data) {
      const absence = absences.find(
        (absenceValue) => absenceValue.studentId === studentId
      );
      if (absence) {
        deleteAbsence({ absenceId: absence._id });
      }
    }
  };
  return (
    <DialogWrapper setOpen={setOpen} title="Devamsızlık Yapanlar">
      <List>
        {data &&
          data.students.map((studentValue) => (
            <ListItem key={studentValue._id}>
              <StudentAvatar studentId={studentValue._id} />
              <ListItemText
                primary={studentValue.fullName}
                secondary={studentValue.schoolNo}
              />
              <ListItemSecondaryAction>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => handleDelete(studentValue._id)}
                >
                  İPTAL
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </DialogWrapper>
  );
}
