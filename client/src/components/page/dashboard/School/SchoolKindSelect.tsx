import * as React from "react";

import { Divider, FormControl, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Skeleton from "@material-ui/lab/Skeleton";

import {
  School,
  SchoolGFragment,
  useSchoolsGQuery,
} from "../../../../generated/graphql";

type PropsType = {
  onChangeSchoolG: (value: SchoolGFragment | null | undefined) => void;
  value?: School["schoolKindId"];
};

export default function SchoolKindSelect(props: PropsType) {
  const { onChangeSchoolG, value } = props;
  const { data, loading } = useSchoolsGQuery();
  return (
    <FormControl fullWidth margin="dense">
      {loading && (
        <>
          <Skeleton />
          <Divider />
        </>
      )}
      {!loading && (
        <Autocomplete
          options={data ? data.schoolsG : []}
          getOptionLabel={(option) => option.name}
          loading={loading}
          multiple={false}
          defaultValue={data && data.schoolsG.find((s) => s._id === value)}
          onChange={(e, value) => onChangeSchoolG(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Okul Tipi"
              fullWidth
            />
          )}
        />
      )}
    </FormControl>
  );
}
