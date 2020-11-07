import * as React from "react";

import { TextField } from "@material-ui/core";

import { UserMapEditProps } from "./type";

export default function UserMapTitleEdit(props: UserMapEditProps) {
  const { setVariables, variables } = props;
  return (
    <>
      <TextField
        value={variables.title}
        label="Başlık"
        fullWidth
        required
        onChange={(e) => {
          setVariables({ ...variables, title: e.currentTarget.value });
        }}
      />
      <TextField
        value={variables.description}
        label="Tanım"
        fullWidth
        required
        onChange={(e) => {
          setVariables({ ...variables, description: e.currentTarget.value });
        }}
      />
    </>
  );
}
