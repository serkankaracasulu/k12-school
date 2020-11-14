import * as React from "react";
import uniqid from "uniqid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton, Grid, Divider } from "@material-ui/core";
import { Delete as DeleteIcon, Add as AddIcon } from "@material-ui/icons";
import { DateTime } from "luxon";
import VoyageCreateItem from "./VoyageItem";
import { VoyageTimeWithId } from "./type";
import { VoyageTimeInput } from "../../../../../generated/graphql";

type PropsType = {
  set(times: VoyageTimeInput[]): void;
  times: VoyageTimeInput[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes back": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
    transform: {
      animationName: "$back",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
    },
    divider: {
      width: "100%",
    },
  })
);

export default function VoyageCreateItems({ times, set }: PropsType) {
  const [changedId, setChangedId] = React.useState("");
  const classes = useStyles();
  const [timeList, setTimeList] = React.useState<Set<VoyageTimeWithId>>(
    new Set<VoyageTimeWithId>(
      times.map((t) => {
        return { ...t, id: uniqid.process() };
      })
    )
  );
  const handleChange = (oldTime: VoyageTimeWithId, time: VoyageTimeWithId) => {
    const newTimeList = new Set(timeList.values());
    const oldIndex = times.indexOf(oldTime);
    newTimeList.delete(oldTime);
    newTimeList.add(time);
    const orderTimeList = [...newTimeList.values()].sort((a, b) => {
      if (a.day < b.day) return -1;
      else if (a.day === b.day) {
        if (a.hour.valueOf() < b.hour.valueOf()) return -1;
        else return 0;
      }

      return 0;
    });
    const newIndex = orderTimeList.indexOf(time);
    if (oldIndex !== newIndex) setChangedId(oldTime.id);
    else if (changedId) setChangedId("");
    setTimeList(new Set(orderTimeList));
    set(
      orderTimeList.map((o) => {
        const { id, ...rest } = o;
        return rest;
      })
    );
  };
  const handleAdd = () => {
    const lastItem: VoyageTimeInput =
      times.length > 0
        ? {
            ...times[times.length - 1],
            hour: DateTime.fromISO(times[times.length - 1].hour)
              .plus({ minutes: 5 })
              .toFormat("HH:mm"),
          }
        : {
            day: 0,
            hour: DateTime.local().toFormat("HH:mm"),
            isTakeSchool: false,
          };
    const newList = new Set(timeList.values());
    newList.add({ ...lastItem, id: uniqid.process() });
    setTimeList(newList);
    set(
      [...newList].map((o) => {
        const { id, ...rest } = o;
        return rest;
      })
    );
  };
  const handleRemove = (item: VoyageTimeWithId) => {
    const newList = new Set(timeList.values());
    newList.delete(item);
    setTimeList(newList);
    set(
      [...newList].map((o) => {
        const { id, ...rest } = o;
        return rest;
      })
    );
  };
  return (
    <div>
      {[...timeList].map((timeItem) => (
        <Grid
          key={timeItem.id}
          container
          className={changedId === timeItem.id ? classes.transform : undefined}
        >
          <Grid item>
            <IconButton onClick={() => handleRemove(timeItem)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <VoyageCreateItem
              time={timeItem}
              set={(newTime) => handleChange(timeItem, newTime)}
            />
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
      ))}
      <IconButton onClick={handleAdd}>
        <AddIcon />
      </IconButton>
    </div>
  );
}
