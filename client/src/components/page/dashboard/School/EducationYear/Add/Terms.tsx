import enLocale from "date-fns/locale/en-US";
import trLocale from "date-fns/locale/tr";
import * as React from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { TermInput } from "../../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
  })
);

type PropsType = {
  term: TermInput;
  setTerm(values: TermInput): void;
  terms: TermInput[];
};

export default function Hours(props: PropsType) {
  const { term, setTerm, terms } = props;
  const classes = useStyles();
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTerm({ ...term, [name]: event.currentTarget.value });
  };
  const handleDateChange = (name: string) => (date: Date | null) => {
    setTerm({
      ...term,
      [name]: date,
    });
  };
  return (
    <div className={classes.root}>
      {terms.length > 0 && (
        <TableContainer>
          <Table aria-label="terms">
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell align="right">Başlangıç</TableCell>
                <TableCell align="right">Bitiş</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {terms.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.start}</TableCell>
                  <TableCell align="right">{row.finish}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography variant="body2">
        Dönem takvim bilgilerini ekleyiniz.
      </Typography>
      <TextField
        variant="standard"
        margin="normal"
        required
        onChange={handleChange("name")}
        value={term.name}
        fullWidth
        aria-label="term name"
        label="Dönem adı"
        autoFocus
        type="text"
      />
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={navigator.language === "tr-TR" ? trLocale : enLocale}
      >
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          value={term.start}
          fullWidth
          id="start"
          label="Dönem başlangıç tarihi"
          onChange={handleDateChange("start")}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          value={term.finish}
          id="finish"
          fullWidth
          label="Dönem bitiş tarihi"
          onChange={handleDateChange("finish")}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
