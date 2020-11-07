import * as React from "react";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: "1rem",
      marginBottom: theme.spacing(4),
    },
  })
);
const campan = [
  "Kayıt olmak ücretsiz.",
  "Kayıtlı öğrenci ve personel sayısına göre ücret uygulanır.",
  "Taahhüt yok istediğiniz zaman iptal edin.",
];
export default function Info() {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <List>
        {campan.map((item) => (
          <ListItem key={item}>
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
