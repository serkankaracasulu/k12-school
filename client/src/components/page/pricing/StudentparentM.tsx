import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 0, 6),
      display: "block",
    },
  })
);

export default function TeacherM() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Typography
        component="h4"
        variant="h5"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Öğrenciler ve Veliler
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        component="p"
      >
        Ders programındaki değişikler için anlık bildirim. Ödev, sınav,
        devamsızlık ve duyuruları uygulama üzerinden takip edebilme
        <Link>Daha detaylı incelemek için</Link>
      </Typography>
    </Grid>
  );
}
