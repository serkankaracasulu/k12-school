/* eslint-disable react/prop-types */
import * as React from "react";
import { TextField, IconButton } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Remove, Add } from "@material-ui/icons";
import { subTime, addTimetoMinute } from "../../../../../helper/generateHours";
import HoursTable from "./HoursTable";
import { CreateHourInput } from "../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: 25,
  },
  info: {
    marginTop: theme.spacing(1),
  },
}));
type PropsType = {
  variables: CreateHourInput;
  isEdit: boolean;
  setVariables(values: CreateHourInput): void;
};

export default function HoursForm(props: PropsType) {
  const { variables, setVariables, isEdit } = props;
  const classes = useStyles();
  const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const patt = new RegExp(/^((?:[01]\d|2[0-3]):[0-5]\d$)/g);
    if (event.target instanceof HTMLInputElement) {
      const res = patt.test(event.currentTarget.value);
      if (!res) return;
      const changeAmount = subTime(
        variables.hour[0].start,
        event.currentTarget.value
      );
      const hour = variables.hour.map((hourItem) => {
        const start = addTimetoMinute(hourItem.start, changeAmount);
        const finish = addTimetoMinute(hourItem.finish, changeAmount);
        return { ...hourItem, start, finish };
      });
      setVariables({ ...variables, hour });
    }
  };
  const handleRemoveTime = (code: number) => {
    const hour = variables.hour.filter((item) => item.code !== code);
    setVariables({ ...variables, hour });
  };

  const handleAddTime = () => {
    const { finish } = variables.hour[variables.hour.length - 1];
    const lessonTime = subTime(
      variables.hour[variables.hour.length - 1].start,
      finish
    );
    const hour = [
      ...variables.hour,
      {
        code: +variables.hour[variables.hour.length - 1].code + 1,
        start: addTimetoMinute(finish, 20),
        finish: addTimetoMinute(finish, 20 + lessonTime),
      },
    ];
    setVariables({ ...variables, hour });
  };
  const handleBreathChange = (i: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = 0;
    if (
      !(
        isNaN(+event.currentTarget.value) ||
        +event.currentTarget.value < 0 ||
        +event.currentTarget.value > 480 ||
        event.currentTarget.value === ""
      )
    ) {
      value = +event.currentTarget.value;
    }
    const dif =
      value - subTime(variables.hour[i].finish, variables.hour[i + 1].start);
    const hour = variables.hour.map((h, index) => {
      if (index > i) {
        const start = addTimetoMinute(h.start, dif);
        const finish = addTimetoMinute(h.finish, dif);
        return { ...h, start, finish };
      }
      return h;
    });
    setVariables({ ...variables, hour });
  };
  const times = variables.hour.map((item, index) => {
    return {
      ...item,
      removeTime: function RemoveTime() {
        return (
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleRemoveTime(item.code)}
          >
            <Remove />
          </IconButton>
        );
      },
      addTime: function AddTime() {
        return (
          <IconButton size="small" color="primary" onClick={handleAddTime}>
            <Add />
          </IconButton>
        );
      },
      setStart: function SetStart() {
        return (
          <TextField
            type="time"
            value={item.start}
            onChange={handleStartChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 900, // 5 min
            }}
          />
        );
      },
      breath: function Breath() {
        return (
          <TextField
            type="text"
            onChange={handleBreathChange(index)}
            className={classes.textField}
            value={subTime(item.finish, variables.hour[index + 1].start)}
          />
        );
      },
    };
  });
  return <HoursTable times={times} isEdit={isEdit} />;
}
