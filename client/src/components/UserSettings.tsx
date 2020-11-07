import * as React from "react";

import BottomBar from "./MainBottomBar";
import AppBar from "./page/pricing/MainAppBar";
import UserAvatarMenu from "./UserAvatar/UserAvatarMenu";

export default function UserAvatar() {
  return (
    <>
      <AppBar />
      <UserAvatarMenu />
      <BottomBar />
    </>
  );
}
