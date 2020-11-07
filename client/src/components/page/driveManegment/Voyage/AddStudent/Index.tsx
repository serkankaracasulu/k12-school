import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  AddStudentVoyageMutationVariables,
  useStudentsDriverLazyQuery,
} from "../../../../../generated/graphql";
import DialogWrapper from "../../../../DialogW";
import StudentSelect from "../../../../StudentSelect";
import AddButton from "./AddButton";

type PropsType = {
  institutionId: string;
  voyageId: string;
  setOpen(): void;
};
export default function VoyageStudentAdd({
  institutionId,
  voyageId,
  setOpen,
}: PropsType) {
  const [variables, setVariables] = React.useState<
    AddStudentVoyageMutationVariables
  >({
    studentId: "",
    voyageId,
  });
  const [value, setValue] = React.useState("");
  const [fetchStudents, { loading, data }] = useStudentsDriverLazyQuery({
    onError: () => {},
  });
  const handleSetValue = (studentfullaname: string) => {
    setValue(studentfullaname);
    fetchStudents({ variables: { search: studentfullaname, institutionId } });
  };
  const handleChange = (studentId: string) => {
    setVariables({ ...variables, studentId });
  };
  return (
    <DialogWrapper title="Öğrenci ekle" setOpen={setOpen}>
      <StudentSelect
        multiple={false}
        students={data?.studentsDriver || []}
        loading={loading}
        institutionId={institutionId}
        setStudentId={handleChange}
        value={value}
        setValue={handleSetValue}
      />
      <Typography variant="caption" color="textSecondary">
        En son eklediğiniz öğrencileri bulabilmeniz için tekrar kullanıcı girişi
        yapmanız gerekiyor
      </Typography>
      <DialogActions>
        <Button onClick={setOpen}>İPTAL</Button>
        <AddButton variables={variables} />
      </DialogActions>
    </DialogWrapper>
  );
}
