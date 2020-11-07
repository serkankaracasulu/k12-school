import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "@material-ui/styles";

import Loading from "./Loading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    content: {
      minHeight: 100,
      minWidth: 200,
      paddingBottom: theme.spacing(1),
    },
    title: {
      fontWeight: 200,
      marginRight: theme.spacing(4),
    },
  })
);

type PropsType = {
  setOpen(): void;
  children: React.ReactNode;
  title: string;
  maxWidth?: false | "sm" | "md" | "xs" | "lg" | "xl";
  loading?: boolean;
};
export default function DialogWrapper(props: PropsType) {
  const { setOpen, children, title, maxWidth, loading } = props;
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Dialog
      open
      fullWidth={Boolean(maxWidth)}
      maxWidth={maxWidth}
      onClose={setOpen}
      fullScreen={fullScreen}
    >
      {loading && <Loading />}
      <DialogTitle>
        <Typography variant="inherit" gutterBottom className={classes.title}>
          {title}
        </Typography>

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={setOpen}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
}
DialogWrapper.defaultProps = {
  maxWidth: "md",
  loading: false,
};
