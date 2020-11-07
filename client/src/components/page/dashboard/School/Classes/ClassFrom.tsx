/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  CreateClassInput,
  useSchoolGLazyQuery,
} from "../../../../../generated/graphql";
import upperCase from "../../../../../helper/uppercase";

type PropsType = {
  values: CreateClassInput;
  setValues(values: CreateClassInput): void;
  schoolKindId?: string | null;
};

type OptionType = { value: number; label: string | number };
export default function ClassForm(props: PropsType) {
  const { setValues, values, schoolKindId } = props;
  const [fetchData, { data, loading }] = useSchoolGLazyQuery();
  React.useEffect(() => {
    if (schoolKindId) fetchData({ variables: { id: schoolKindId } });
  }, [schoolKindId]);
  function getSuggestion() {
    let lookup = [{ value: 0, label: "Hazırlık" }];
    if (data) {
      lookup = data.schoolG.classes.map((c) => {
        return {
          value: c.level,
          label: c.level === 0 ? "Hazırlık" : `${c.level}`,
        };
      });
    } else
      for (let index = 1; index <= 18; index += 1) {
        lookup.push({ value: index, label: index.toString() });
      }
    return lookup;
  }
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const handleCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (navigator.language === "tr" || navigator.language === "tr-TR")
      setValues({
        ...values,
        code: upperCase(event.target.value),
      });
  };
  return (
    <form>
      <Autocomplete
        getOptionLabel={(option) => option.label}
        options={getSuggestion()}
        onChange={(event, newValue) => {
          newValue &&
            setValues({
              ...values,
              level: newValue.value,
            });
        }}
        loading={loading}
        multiple={false}
        defaultValue={
          values.level
            ? {
                value: values.level,
                label: values.level === 0 ? "Hazırlık" : `${values.level}`,
              }
            : undefined
        }
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Sınıf" fullWidth />
        )}
      />
      <TextField
        variant="standard"
        margin="normal"
        fullWidth
        value={values.code || ""}
        onChange={handleCode}
        aria-label="code"
        label="Şube"
        autoFocus
        type="text"
      />
      <TextField
        variant="standard"
        margin="normal"
        fullWidth
        value={values.code1 || ""}
        onChange={handleChange("code1")}
        aria-label="code1"
        label="Şube özelliği"
        autoFocus
        type="text"
      />
      <TextField
        variant="standard"
        margin="normal"
        fullWidth
        value={values.name || ""}
        onChange={handleChange("name")}
        aria-label="name"
        label="İsim"
        autoFocus
        type="text"
      />
    </form>
  );
}
