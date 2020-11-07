import { DateTime } from "luxon";
import * as React from "react";

import {
  Button,
  ButtonGroup,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/Mail";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { useDriverApplicationsQuery } from "../../../../generated/graphql";
import Context from "../../../Context";
import driverApplicationMutate from "../../../driverApplicationMutate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
    tr: {
      "& td": {
        borderBottom: 0,
        paddingBottom: 0,
      },
    },
    tBody: {
      "& tr:nth-child(4n+1)": {
        backgroundColor: theme.palette.grey[100],
      },
      "& tr:nth-child(4n+2)": {
        backgroundColor: theme.palette.grey[100],
      },
    },
    tdLeft: {
      paddingLeft: theme.spacing(5),
      paddingRight: 0,
      borderTop: 0,
      "& div": {
        paddingRight: theme.spacing(1),
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        paddingTop: theme.spacing(2),
      },
    },
    tdRight: {
      paddingRight: theme.spacing(5),
      paddingLeft: 0,
      borderTop: 0,
      "& div": {
        paddingRight: theme.spacing(1),
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        paddingTop: theme.spacing(2),
      },
    },
  })
);
const columns = ["Başvuru Tarihi", "Ad Soyad", "E-Mail"];
export default function Aplications() {
  const classes = useStyles();
  const { data } = useDriverApplicationsQuery();
  const { setPr } = React.useContext(Context);
  const [handleDelete, handleAccept, handleResend] = driverApplicationMutate(
    setPr
  );
  return (
    <Container maxWidth="lg" className={classes.container}>
      {data && data.driverApplications && (
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className={classes.tBody}>
            {data.driverApplications.map((applicaitonValue) => (
              <React.Fragment key={applicaitonValue._id}>
                <TableRow className={classes.tr}>
                  <TableCell>
                    {DateTime.fromISO(applicaitonValue.createdAt).toISODate()}
                  </TableCell>
                  <TableCell>
                    <Link variant="body2" component="button">
                      {applicaitonValue.userFullName}
                    </Link>
                  </TableCell>
                  <TableCell>{applicaitonValue.email} </TableCell>
                  <TableCell>
                    {applicaitonValue.status === 0 && (
                      <Button
                        size="small"
                        startIcon={<MailIcon />}
                        onClick={() => handleResend(applicaitonValue._id)}
                      >
                        TEKRAR GÖNDER
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    align="right"
                    scope="row"
                    className={classes.tdLeft}
                  >
                    <div>
                      <b>Durum</b>
                    </div>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className={classes.tdRight}
                  >
                    <Typography variant="body2" component="div">
                      {getStatus(applicaitonValue.status)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      {applicaitonValue.status === 2 && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAccept(applicaitonValue._id)}
                          endIcon={<PersonAddIcon />}
                        >
                          KABUL ET
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(applicaitonValue._id)}
                      >
                        DAVETİ SİL
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
      <div />
    </Container>
  );
}
function getStatus(status: number) {
  switch (status) {
    case 0:
      return "Başvuru ve hesap oluşturması için e-mail gönderildi.";
    case 1:
      return "Kullanıcıya davet gönderildi ";
    case 2:
      return "Kullanıcı isteği kabul etti";
    default:
      return "";
  }
}
