import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  EducationYear,
  SchoolDocument,
  SchoolQuery,
  SchoolQueryVariables,
  useDeleteEducationYearMutation,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../../helper/generateMessage";
import SchoolContext from "../../../../../Context";
import DialogWrapper from "../../../../../DialogW";
import messageBox from "./messageBox";

type PropsType = {
  educaitonYear: EducationYear;
  setOpen(): void;
  schoolId: string;
};

export default function Delete(props: PropsType) {
  const { educaitonYear, setOpen, schoolId } = props;
  const { setPr } = React.useContext(SchoolContext);
  const [deleteEducationYear] = useDeleteEducationYearMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleDelete = () => {
    deleteEducationYear({
      variables: { schoolId, id: educaitonYear._id },
      update: (proxy, mutationResult) => {
        if (
          mutationResult.data &&
          mutationResult.data.deleteEducationYear.success
        ) {
          const { _id } = mutationResult.data.deleteEducationYear;
          const schoolQuery = proxy.readQuery<
            SchoolQuery,
            SchoolQueryVariables
          >({
            query: SchoolDocument,
            variables: { id: schoolId },
          });
          if (schoolQuery) {
            const { school } = schoolQuery;
            const educationYears = school.educationYears.filter(
              (ey) => ey._id !== _id
            );
            proxy.writeQuery<SchoolQuery, SchoolQueryVariables>({
              query: SchoolDocument,
              variables: { id: schoolId },
              data: { school: { ...school, educationYears } },
            });
          }
        }
      },
    });
  };
  return (
    <DialogWrapper title={educaitonYear.name} setOpen={setOpen}>
      <Typography variant="h5">
        Dönemini silmek istedğinizden emin misiniz?
      </Typography>
      <Typography variant="body2">
        * Bu dönem de kayıt olmuş bütün dersler de silinecektir.
      </Typography>
      <DialogActions>
        <Button onClick={setOpen}>İPTAL</Button>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          EVET
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
