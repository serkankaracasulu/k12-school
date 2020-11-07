import * as React from "react";

import { Grid, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(8, 0, 6),
      display: "block",
    },
  })
);

export default function SchoolM() {
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
        Okul yöneticileri
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        component="p"
      >
        Okulunuzdaki bütün öğretmen, öğrenci ve veliler ile anında iletişimde
        olun, Gerekli verileri Eokul sisteminden bizim uygulamamız ile kolayca
        aktarın. Kullanıcı dostu arayüzü ile aradağınız herşey elinizin altında.{" "}
        <Link>Daha detaylı incelemek için</Link>
      </Typography>
    </Grid>
  );
}
