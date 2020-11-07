import * as React from "react";

import { Container, Grid, Paper, useMediaQuery } from "@material-ui/core/";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

import MainBottomBar from "../../MainBottomBar";
import Cards from "./Cards";
import Footer from "./Footer";
import Banner from "./HeroUnit";
import MainAppBar from "./MainAppBar";
import Schoolm from "./SchoolM";
import StudentParent from "./StudentparentM";
import TeacherM from "./TeacherM";

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
    heroContent: {
      padding: theme.spacing(8, 0, 6),
    },
    price: {
      padding: theme.spacing(8, 0, 2),
    },
    section: {
      maxWidth: "450px",
    },
    appBarSpacer: theme.mixins.toolbar,
  })
);

export default function Pricing() {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {fullScreen && <MainBottomBar />}
      <MainAppBar />
      <div className={classes.appBarSpacer} />
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Banner />
      </Container>
      <Paper elevation={0}>
        <Container maxWidth="md">
          <Grid container>
            <Grid item>
              <div className={classes.section}>
                <Schoolm />
              </div>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <div className={classes.section}>
                <TeacherM />
              </div>
            </Grid>
          </Grid>
          <Grid container justify="flex-start">
            <Grid item>
              <div className={classes.section}>
                <StudentParent />
              </div>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      {/* End hero unit */}
      <Cards />
      <Footer />
    </>
  );
}
