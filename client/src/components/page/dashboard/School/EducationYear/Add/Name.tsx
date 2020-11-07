import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    text: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

type PropsType = {
  name: string;
  setName(name: string): void;
};
export default function EducationYearAddName(props: PropsType) {
  const { name, setName } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="body2">
        Eğitim yılı için isim veriniz veya varsayılan olarak girileni
        onaylayınız.
      </Typography>
      <TextField
        className={classes.text}
        label="Eğitim Yılı ismi"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        fullWidth
      />
    </div>
  );
}
