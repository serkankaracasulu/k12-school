import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import * as React from "react";

import { Grid, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

import { StudentFragment } from "../generated/graphql";
import upperCase from "../helper/uppercase";
import StudentAvatar from "./page/dashboard/StudentAvatar";

type PropsType = {
  students: StudentFragment[];
  loading?: boolean;
  multiple: boolean;
  setStudentId(studentId: string | string[]): void;
  value: string;
  setValue(value: string): void;
  institutionId?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectRoot: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  })
);

export default function StudentSelect({
  students,
  loading,
  setStudentId,
  multiple,
  value,
  setValue,
  institutionId,
}: PropsType) {
  const classes = useStyles();
  const textInput = React.useRef<HTMLInputElement>(null);
  return (
    <Autocomplete
      multiple={multiple}
      options={students}
      getOptionLabel={(option) => option.fullName}
      loading={loading}
      classes={{
        root: classes.selectRoot,
      }}
      onChange={(e, value) => {
        const studentIds: string[] = [];
        let studentId = "";
        if (Array.isArray(value)) {
          for (const v of value) {
            if (typeof v === "string") studentIds.push(v);
            else if (typeof v === "object") studentIds.push(v._id);
          }
        } else if (typeof value === "string") studentId = value;
        else if (value) studentId = value._id;
        setStudentId(studentId || studentIds);
      }}
      groupBy={(option) => option.className || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Öğrenciler"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputRef={textInput}
          placeholder="T.C, Ad, Soyad"
          fullWidth
        />
      )}
      freeSolo
      renderOption={(option) => {
        const inputValue = upperCase(textInput.current?.value || "");
        const matches = match(option.fullName, inputValue);
        const nameParts = parse(option.fullName, matches);
        const citizenshipMatches = match(option.citizenshipId, inputValue);
        const citizenshipParts = parse(
          option.citizenshipId,
          citizenshipMatches
        );
        return (
          <Grid container alignItems="center" key={option._id}>
            <Grid item>
              <StudentAvatar studentId={option._id} instId={institutionId} />
            </Grid>
            <Grid item xs>
              {nameParts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                T.C :
                {citizenshipParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
