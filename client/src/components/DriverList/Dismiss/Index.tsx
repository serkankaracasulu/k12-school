import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  DriversWithAppQuery,
  useDismissDriverMutation,
} from "../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../helper/generateMessage";
import SchoolContext from "../../Context";
import DialogWrapper from "../../DialogW";
import messageBox from "./messageBox";

type PropsType = {
  driver: DriversWithAppQuery["drivers"][0];
  setOpen(): void;
};
export default function Dismiss(props: PropsType) {
  const { driver, setOpen } = props;
  const { setPr } = React.useContext(SchoolContext);
  const [dismiss] = useDismissDriverMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleDismiss = () => {
    dismiss({ variables: { driverId: driver._id } });
  };
  return (
    <DialogWrapper title={driver.fullName} setOpen={setOpen}>
      <Typography variant="h6">
        Sürücüyü kurumdan çıkarmak istediğinizden emin misiniz?
      </Typography>
      <DialogActions>
        <Button onClick={setOpen}>Hayır</Button>
        <Button variant="contained" color="secondary" onClick={handleDismiss}>
          Evet
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
