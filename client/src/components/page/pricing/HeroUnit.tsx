import * as React from "react";

import { Grid, Typography } from "@material-ui/core";

import v from "../../../v.json";

export default function HeroUnit() {
  return (
    <Grid container>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Eğitim kurumları ve Öğretmenler için buluşma noktası
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
      >
        {v.name} &apos;un genel amacı, Eğitim kurumlarının, öğrtemenlerin,
        velilerin ve öğrencilerin modern bir uygulama ile birbirleriyle kolayca
        etkileşim içerisinde olmasını sağlamak.
      </Typography>
    </Grid>
  );
}
