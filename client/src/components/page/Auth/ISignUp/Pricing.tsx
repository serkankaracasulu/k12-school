import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CloseRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: theme.palette.common.white,
      },
      ul: {
        margin: 0,
        padding: 0,
      },
      li: {
        listStyle: "none",
      },
    },
    paper: {
      padding: "1rem",
      marginBottom: theme.spacing(4),
    },
    cardHeader: {
      backgroundColor: theme.palette.grey[200],
    },
    cardPricing: {
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      marginBottom: theme.spacing(2),
    },
    margin: {
      margin: theme.spacing(0),
    },
  })
);
const price = 2;
const tier = {
  title: "Standart",
  subheader: "Tek tarife, tek fiyat",
  price,
  description: [`Öğrenci ve personel başına aylık ${price} TL`],
};
export default function Pricing() {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        title={tier.title}
        subheader={tier.subheader}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{ align: "center" }}
        className={classes.cardHeader}
      />
      <CardContent>
        <div className={classes.cardPricing}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid>
              <Typography component="h2" variant="h2" color="textPrimary">
                {tier.price}TL
              </Typography>
            </Grid>
            <Grid item>
              <CloseRounded />
            </Grid>
            <Typography variant="h3" color="textPrimary" align="center">
              (
            </Typography>
            <Grid item>
              <Typography
                variant="h6"
                color="textSecondary"
                align="center"
                className={classes.margin}
              >
                öğrenci
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                align="center"
                className={classes.margin}
              >
                +
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                align="center"
                className={classes.margin}
              >
                personel
              </Typography>
            </Grid>
            <Typography variant="h3" color="textPrimary" align="center">
              )
            </Typography>
            <Grid item>
              <Typography variant="h4" color="textPrimary" align="center">
                /ay
              </Typography>
            </Grid>
          </Grid>
        </div>
        <ul>
          {tier.description.map((line) => (
            <Typography
              component="li"
              variant="subtitle1"
              align="center"
              key={line}
            >
              {line}
            </Typography>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
