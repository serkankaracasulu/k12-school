/* eslint-disable react/display-name */
import * as React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core/";
import StarIcon from "@material-ui/icons/StarBorder";

const buylink = React.forwardRef<any, Omit<LinkProps, "to">>((props, ref) => (
  <RouterLink innerRef={ref} to="/isignup" {...props} />
));
const signUpLink = React.forwardRef<any, Omit<LinkProps, "to">>(
  (props, ref) => <RouterLink innerRef={ref} to="/signup" {...props} />
);
type Tier = {
  title: string;
  description: string[];
  buttonVariant: "text" | "outlined" | "contained";
  buttonText: string;
  subheader?: string;
  component?: any;
};
const tiers: Tier[] = [
  {
    title: "Okul",
    description: ["Öğrenci başına", "aylık", "0,6 ₺"],
    buttonText: "Kayıt ol",
    buttonVariant: "contained",
    component: buylink,
  },
  {
    title: "Öğretmenler",
    description: ["Ücretsiz"],
    buttonText: "Kayıt ol",
    buttonVariant: "outlined",
    component: signUpLink,
  },
];

const useStyles = makeStyles((theme) => ({
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
  card: {
    height: "100px",
  },
  cardHeader: {
    backgroundColor: theme.palette.secondary.main,
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
}));

const Cards = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="md" component="main">
      <Grid container spacing={5} alignItems="flex-end" justify="center">
        {tiers.map((tier) => (
          // Enterprise card is full width at sm breakpoint
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === "Enterprise" ? 12 : 6}
            md={4}
          >
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: "center" }}
                subheaderTypographyProps={{ align: "center" }}
                action={tier.title === "Pro" ? <StarIcon /> : null}
                className={classes.cardHeader}
              />
              <CardContent className={classes.card}>
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
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color="primary"
                  component={tier.component}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Cards;
