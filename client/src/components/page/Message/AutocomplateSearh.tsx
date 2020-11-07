import * as React from "react";

import { TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { PersonKind, useFindUserLazyQuery } from "../../../generated/graphql";
import StudentAvatar from "../dashboard/StudentAvatar";
import UserProfileAvatar from "../dashboard/UserAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      marginLeft: theme.spacing(2),
    },
  })
);

type PorpsType = {
  setTo(users: string[]): void;
};
export default function AutocomplateSearch(props: PorpsType) {
  const { setTo } = props;
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [findUser, { loading: loadingUser, data }] = useFindUserLazyQuery({
    onCompleted: () => {},
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  React.useEffect(() => {
    if (inputValue === "") {
      return undefined;
    }
    findUser({ variables: { search: inputValue } });
  }, [inputValue, findUser]);

  return (
    <Autocomplete
      id="student-find"
      onChange={(e, persons) => {
        setTo(persons.map((personValue) => personValue._id));
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.fullName
      }
      options={data?.findUser || []}
      autoComplete
      multiple
      groupBy={(option) => {
        if (option.kind === PersonKind.Student) return "Öğrenci";
        else if (option.parentStudents.length > 0) return "Veli";
        else if (option.teacher) return "Öğretmen";
        else return "Personel";
      }}
      loading={loadingUser}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Bir veya birden falza kişi giriniz"
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              {option.kind === PersonKind.Student && (
                <StudentAvatar studentId={option._id} />
              )}
              {option.kind === PersonKind.User && (
                <UserProfileAvatar personId={option._id} />
              )}
            </Grid>
            <Grid container item direction="column" sm>
              <Grid item>
                <Typography variant="body1" className={classes.text}>
                  {option.fullName}
                </Typography>
                <Typography variant="caption" className={classes.text}>
                  {option.teacher
                    ? "Öğretmen"
                    : option.driver
                    ? "Sürücü"
                    : option.parentStudents.length > 0
                    ? "Veli"
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
