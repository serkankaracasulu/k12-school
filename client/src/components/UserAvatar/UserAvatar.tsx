import * as React from "react";

import { IconButton } from "@material-ui/core/";

import DropDown from "../DropDown/DropDown";
import UserProfileAvatar from "../page/dashboard/UserAvatar";
import UserAvatarMenu from "./UserAvatarMenu";

export default function UserAvatar() {
  const [open, setOpen] = React.useState(false);

  function handleClose() {
    setOpen(false);
  }
  return (
    <DropDown
      onClose={handleClose}
      open={open}
      button={
        <IconButton onClick={() => setOpen(!open)} color="inherit">
          <UserProfileAvatar size="small" />
        </IconButton>
      }
    >
      <UserAvatarMenu />
    </DropDown>
  );
}
