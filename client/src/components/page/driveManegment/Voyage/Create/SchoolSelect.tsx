import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSchoolsQuery } from "../../../../../generated/graphql";

type PropsType = {
  setVar(schoolId: string): void;
  schoolId: string;
  institutionId: string;
};
export default function SchoolSelect({
  setVar,
  schoolId,
  institutionId,
}: PropsType) {
  const { data, loading } = useSchoolsQuery({
    variables: { institutionId },
  });

  return (
    <Autocomplete
      options={data?.schools || []}
      loading={loading}
      onChange={(e, d) => setVar(d?._id || "")}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Okul Seçiniz" variant="outlined" />
      )}
    />
  );
}
