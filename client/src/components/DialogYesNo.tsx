import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import DialogWrapper from "./DialogW";

type PropsType = {
  setClose(): void;
  title: string;
  primaryText: string;
  handleYes(): void;
};

export default function DialogYesNo({
  setClose,
  title,
  primaryText,
  handleYes,
}: PropsType) {
  return (
    <DialogWrapper title={title} setOpen={setClose}>
      <Typography>{primaryText}</Typography>
      <DialogActions>
        <Button onClick={setClose}>HAYIR</Button>
        <Button variant="contained" color="primary" onClick={handleYes}>
          EVET
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
