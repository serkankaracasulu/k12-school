import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import educationYearValues from "./defaultEducationYear";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
  })
);
const Columns = ["İsim", "Başlangıç", "Bitiş"];

export default function EducationYearDefault() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {Columns.map((item) => {
              return <TableCell key={item}>{item}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {educationYearValues.terms.map((item, index) => {
            return (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.start}</TableCell>
                <TableCell>{item.finish}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Typography variant="body1" color="textPrimary">
        Dönem bilgilerinizi Milli Eğitim Bakanlığının yayınladığı takvime göre
        ayarlamak ister misiniz ?
      </Typography>
    </div>
  );
}
