import "date-fns";

import * as React from "react";

import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { VoyageTimeInput } from "../../../../../generated/graphql";
import days from "../../../../days";
import { VoyageTimeWithId } from "./type";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    buttons: {
      margin: theme.spacing(1),
    },
    textField: {
      margin: theme.spacing(1),
      width: 80,
    },
  })
);

type PropsType = {
  set(time: VoyageTimeWithId): void;
  time: VoyageTimeWithId;
};
export default function VoyageCreateItem({ set, time }: PropsType) {
  const classes = useStyles();
  return (
    <Grid container item alignItems="flex-end">
      <FormControl className={classes.formControl}>
        <InputLabel id="voyage-day">Gün</InputLabel>
        <Select
          labelId="voyage-day"
          value={time.day}
          onChange={(e) => {
            set({
              ...time,
              day: e.target.value as VoyageTimeInput["day"],
            });
          }}
        >
          {days.map((day, index) => (
            <MenuItem value={index} key={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="time"
        label="Saat"
        type="time"
        value={time.hour}
        className={classes.textField}
        onChange={(e) => set({ ...time, hour: e.target.value })}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
      <ButtonGroup className={classes.buttons}>
        <Button
          onClick={() => set({ ...time, isTakeSchool: true })}
          color={time.isTakeSchool ? "primary" : "secondary"}
          variant={time.isTakeSchool ? "contained" : "text"}
        >
          {time.isTakeSchool ? "Evden" : "Okuldan"}
        </Button>
        <Button
          onClick={() => set({ ...time, isTakeSchool: false })}
          variant={time.isTakeSchool ? "text" : "contained"}
          color={time.isTakeSchool ? "secondary" : "primary"}
        >
          {time.isTakeSchool ? "Okula" : "Eve"}
        </Button>
      </ButtonGroup>
    </Grid>
  );
}
