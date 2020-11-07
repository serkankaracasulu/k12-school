import jwt from "jwt-decode";
import * as React from "react";

import { Divider } from "@material-ui/core";

import logOutUser from "../../helper/logoutUser";
import DropDownItem from "../DropDown/DropDownItem";
import DropDownList from "../DropDown/DropDownList";
import { Role, UserToken } from "../myTypes";

export default function UserAvatar() {
  const token = localStorage.getItem("token");
  const userToken = token && jwt<UserToken>(token);
  const isParent = userToken && userToken.roles.includes(Role.parent);
  const isStudent = userToken && userToken.roles.includes(Role.student);
  const isDriver = userToken && userToken.roles.includes(Role.driver);
  return (
    <DropDownList title={(userToken && userToken.fullName) || ""}>
      {userToken && (
        <>
          <DropDownItem to="/profile">Ben</DropDownItem>
          {userToken.roles.some(
            (role) => role === Role.owner || role === Role.admin
          ) && <DropDownItem to="/myschools">Okulu Yönet</DropDownItem>}
          {userToken.roles.includes(Role.teacher) && (
            <DropDownItem to="/teacher">Okulum</DropDownItem>
          )}
          {userToken.roles.includes(Role.superadmin) && (
            <DropDownItem to="/managment">Admin</DropDownItem>
          )}
        </>
      )}
      {isStudent && <DropDownItem to="/student">Okulum</DropDownItem>}
      {isParent && <DropDownItem to="/student">Panelim</DropDownItem>}
      {isDriver && <DropDownItem to="/driver">Panelim</DropDownItem>}
      <DropDownItem to="/sucurity">Güvenlik</DropDownItem>
      <Divider component="li" />
      <DropDownItem button onClick={() => logOutUser()}>
        Çıkış
      </DropDownItem>
    </DropDownList>
  );
}
