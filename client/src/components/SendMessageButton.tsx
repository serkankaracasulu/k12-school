import * as React from "react";

import { IconButton } from "@material-ui/core";
import { Mail as SendIcon } from "@material-ui/icons";

import Context from "./Context";

type PropType = {
  to: string;
};

export default function SendMessageButton({ to }: PropType) {
  const { toState } = React.useContext(Context);
  const [, setTo] = toState;
  return (
    <IconButton onClick={() => setTo(to)}>
      <SendIcon />
    </IconButton>
  );
}
