import * as React from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";

import { EducationYear } from "../../../../../generated/graphql";
import DeleteForm from "./Delete/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: blue[100],
    },
    leftBorder: {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
    rightBorder: {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
    rowSpace: {
      border: 0,
      padding: theme.spacing(1),
    },
  })
);

type PropsType = {
  educationYears: EducationYear[];
  schoolId: string;
};

export default function EducationYearTable(props: PropsType) {
  const { educationYears, schoolId } = props;
  const [openDelete, setOpenDelete] = React.useState<EducationYear | void>();
  const classes = useStyles();
  return (
    <>
      <Table aria-label="terms">
        <TableBody>
          {educationYears.map((row) => (
            <React.Fragment key={row._id}>
              <TableRow>
                <TableCell
                  align="center"
                  component="th"
                  colSpan={4}
                  className={classes.header}
                >
                  {row.name}
                </TableCell>
              </TableRow>
              {row.terms.map((term, termIndex) => (
                <TableRow key={term._id}>
                  <TableCell
                    align="left"
                    component="th"
                    className={classes.leftBorder}
                  >
                    {term.name}
                  </TableCell>
                  <TableCell align="left">
                    {new Date(term.start).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="left" className={classes.rightBorder}>
                    {new Date(term.finish).toLocaleDateString()}
                  </TableCell>
                  {termIndex === 0 && (
                    <TableCell
                      align="center"
                      className={classes.rightBorder}
                      rowSpan={row.terms.length}
                    >
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => setOpenDelete(row)}
                        variant="contained"
                        color="secondary"
                      >
                        SİL
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  align="center"
                  component="th"
                  colSpan={3}
                  className={classes.rowSpace}
                />
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {openDelete && (
        <DeleteForm
          schoolId={schoolId}
          setOpen={() => setOpenDelete()}
          educaitonYear={openDelete}
        />
      )}
    </>
  );
}
