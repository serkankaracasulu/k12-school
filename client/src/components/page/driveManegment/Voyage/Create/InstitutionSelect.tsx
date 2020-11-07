import * as React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useDriverInsitutionsQuery } from "../../../../../generated/graphql";

type PropsType = {
  setVar(institutionId: string): void;
  institutionId: string;
};
export default function InstitutionSelect({ setVar }: PropsType) {
  const { data, loading } = useDriverInsitutionsQuery();

  return (
    <Autocomplete
      options={data?.driverInsitutions || []}
      loading={loading}
      onChange={(e, d) => setVar(d?.institutionId || "")}
      multiple={false}
      getOptionLabel={(option) => option.institutionName || ""}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Kurum Seçiniz" variant="outlined" />
      )}
    />
  );
}
