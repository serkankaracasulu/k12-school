import { DateTime } from "luxon";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  EditUserMutationVariables,
  Person,
  useEditUserMutation,
} from "../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(3, 0, 2, 1),
    },
  })
);

type PropsType = {
  variables: Person;
  close(): void;
};

export default function Edit(props: PropsType) {
  const { variables, close } = props;
  const { register, handleSubmit, errors } = useForm<
    EditUserMutationVariables
  >();
  const [editUser, { loading: editLoading }] = useEditUserMutation({
    onCompleted: () => {
      close();
    },
    onError: () => {},
  });

  const handleEdit: SubmitHandler<EditUserMutationVariables> = (data) => {
    if (!data.birthDate) data.birthDate = undefined;
    editUser({ variables: data });
  };
  const classes = useStyles();
  return (
    <Container maxWidth="sm">
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit(handleEdit)}>
          <Typography variant="h4" color="textSecondary" paragraph>
            İletişim Bilgileri
          </Typography>
          <Box display="flex">
            <TextField
              label="Ad"
              name="firstName"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={!!errors.firstName}
              inputRef={register({ minLength: 2, maxLength: 50 })}
              className={classes.textField}
              defaultValue={variables.firstName}
            />
            <TextField
              defaultValue={variables.lastName}
              label="Soyad"
              variant="outlined"
              required
              fullWidth
              error={!!errors.lastName}
              name="lastName"
              inputRef={register({ minLength: 2, maxLength: 50 })}
              margin="normal"
              className={classes.textField}
            />
          </Box>
          <TextField
            label="Telefon"
            margin="normal"
            name="phone"
            variant="outlined"
            inputRef={register({
              min: 5,
              max: 15,
              pattern: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
            })}
            error={!!errors.phone}
            defaultValue={variables.phone}
            className={classes.textField}
          />
          <TextField
            id="time"
            label="Doğum tarihi"
            type="date"
            inputRef={register}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.birthDate}
            name="birthDate"
            defaultValue={
              variables.birthDate
                ? DateTime.fromISO(variables.birthDate).toSQLDate()
                : undefined
            }
          />
          <Box display="flex" justifyContent="flex-end">
            <Button className={classes.button} onClick={close}>
              İptal
            </Button>
            <div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={editLoading}
                className={classes.button}
              >
                Kaydet
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
