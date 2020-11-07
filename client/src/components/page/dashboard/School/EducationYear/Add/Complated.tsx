import * as React from "react";

import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export default function EducationYearAdd() {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.instructions}>
        Eğitim dönemi takvimi kayıt oldu.
      </Typography>
    </div>
  );
}
