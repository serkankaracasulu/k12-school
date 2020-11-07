import * as React from "react";

import { InputAdornment, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ValueType } from "./flowTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type PropsType = {
  values: ValueType;
  setValues(value: ValueType): void;
};
export default function Options(props: PropsType) {
  const { values, setValues } = props;
  const classes = useStyles();
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.currentTarget.value,
    });
  };
  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        margin="normal"
        required
        onChange={handleChange("hourCount")}
        fullWidth
        value={values.hourCount}
        label="Bir gündeki toplam ders saati"
        autoFocus
        type="number"
      />
      <TextField
        variant="standard"
        margin="normal"
        required
        onChange={handleChange("kind")}
        fullWidth
        value={values.kind}
        label="Hangi grup için"
        autoFocus
        type="text"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">normal/sabah/akşam</InputAdornment>
          ),
        }}
      />
      <TextField
        variant="standard"
        margin="normal"
        required
        value={values.breathingTime}
        onChange={handleChange("breathingTime")}
        fullWidth
        label="Ortalama tenefüs süresi"
        autoFocus
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">dakika</InputAdornment>,
        }}
      />
      <TextField
        variant="standard"
        margin="normal"
        required
        value={values.lessonTime}
        onChange={handleChange("lessonTime")}
        fullWidth
        label="Ders süresi"
        autoFocus
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">dakika</InputAdornment>,
        }}
      />
      <TextField
        variant="standard"
        margin="normal"
        required
        value={values.startHour}
        onChange={handleChange("startHour")}
        fullWidth
        label="Ders başlangıç saati"
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </div>
  );
}
