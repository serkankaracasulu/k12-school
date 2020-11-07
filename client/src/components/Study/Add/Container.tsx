import clsx from "clsx";
import * as React from "react";

import { Button, Grid } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { CreateStudyMutationVariables } from "../../../generated/graphql";
import StudyForm from "./Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: theme.spacing(2),
      backgroundColor: "white",
      zIndex: theme.zIndex.drawer,
      maxWidth: theme.breakpoints.values.sm,
      right: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      border: "1px solid rgba(224, 224, 224, 1)",
      boxShadow: theme.shadows[1],
      [theme.breakpoints.down("sm")]: {
        bottom: theme.mixins.toolbar.minHeight,
        right: 0,
        padding: theme.spacing(1),
      },
    },
    min: {
      maxHeight: "1px!important",
      overflow: "hidden",
    },
    form: {
      transition: "max-height 200ms ease-in",
      maxHeight: "500px",
      width: "100%",
    },
  })
);
const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    width: "100%",
    borderRadius: 2,
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))(Button);
type PropsType = {
  newStudy: CreateStudyMutationVariables;
  onValuesChange(value: CreateStudyMutationVariables | void): void;
  intersection: Array<any>;
  week: number;
  close(): void;
};
export default function ContainerForm(props: PropsType) {
  const { newStudy, onValuesChange, intersection, week, close } = props;
  const [min, setMin] = React.useState(false);
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.root}
    >
      <Grid item style={{ width: "100%" }}>
        <ColorButton onClick={() => setMin((prev) => !prev)}>
          {min ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ColorButton>
      </Grid>
      <Grid item className={clsx(min ? classes.min : undefined, classes.form)}>
        <StudyForm
          initialValues={newStudy}
          setOpen={close}
          setValues={onValuesChange}
          intersection={intersection}
          week={week}
        />
      </Grid>
    </Grid>
  );
}
