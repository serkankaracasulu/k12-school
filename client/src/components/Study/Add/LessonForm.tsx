import * as React from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  CreateStudyMutationVariables,
  useLessonsGQuery,
} from "../../../generated/graphql";
import { KeysMatching } from "../../myTypes";

type PropsType = {
  variables: CreateStudyMutationVariables;
  errors: KeysMatching<CreateStudyMutationVariables>;
  handleChange: (
    name: keyof CreateStudyMutationVariables
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function StudyLesson(props: PropsType) {
  const { variables, errors, handleChange } = props;
  const { data, loading } = useLessonsGQuery({
    onError: () => {},
  });
  return (
    <>
      <Autocomplete
        options={data?.lessonsG || []}
        getOptionLabel={(option) => option.name}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Ders"
            fullWidth
            helperText={errors.lessonId}
          />
        )}
      />
      <TextField
        value={variables.subject || ""}
        variant="standard"
        label="Konu"
        required
        fullWidth
        helperText={errors.subject}
        onChange={handleChange("subject")}
      />
      <TextField
        value={variables.detail || ""}
        variant="standard"
        label="Detay"
        fullWidth
        helperText={errors.detail}
        onChange={handleChange("detail")}
      />
    </>
  );
}
