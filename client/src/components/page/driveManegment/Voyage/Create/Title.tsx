import React from "react";

import TextField from "@material-ui/core/TextField";

type PropsType = {
  setVar(title: string): void;
  title: string;
};

export default function VoyageCreateTitle({ setVar, title }: PropsType) {
  const handleChange = (title: string) => {
    setVar(title);
  };
  return (
    <TextField
      value={title}
      label="Başlık"
      variant="outlined"
      onChange={(e) => handleChange(e.currentTarget.value)}
    />
  );
}
