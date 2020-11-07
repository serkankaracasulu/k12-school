import * as React from "react";

import { TextField } from "@material-ui/core";

import { KeysMatching } from "../../myTypes";
import { CreateStudyMutationVariables } from "../../../generated/graphql";

type PropsType = {
  variables: CreateStudyMutationVariables;
  setVariables(date: string): void;
  errors: KeysMatching<CreateStudyMutationVariables>;
  handleChange: (
    name: keyof CreateStudyMutationVariables
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function StudyDate(props: PropsType) {
  const { variables, errors, setVariables, handleChange } = props;
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariables(event.target.value);
  };
  return (
    <>
      <TextField
        label="Tarih"
        variant="standard"
        type="datetime-local"
        required
        onChange={handleDateChange}
        value={variables.date}
      />
      <TextField
        value={variables.duration || ""}
        variant="standard"
        type="number"
        label="Süre"
        required
        helperText={errors.duration}
        onChange={handleChange("duration")}
      />
    </>
  );
}
