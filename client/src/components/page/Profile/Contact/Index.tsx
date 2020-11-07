import { DateTime } from "luxon";
import * as React from "react";

import {
  Container,
  Fab,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Edit as EditIcon } from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";

import { useActiveUserQuery } from "../../../../generated/graphql";
import UserProfileAvatar from "../../dashboard/UserAvatar";
import Edit from "./Edit";
import PhotoForm from "./Photo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      position: "relative",
    },
    avatar: {
      margin: 10,
      width: 150,
      height: 150,
    },
    avatarFont: {
      fontSize: "5rem",
    },
    type: {
      // fontWeight: "bold"
    },
    fab: {
      position: "absolute",
      top: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 100,
      boxShadow: "none",
    },
  })
);
export default function Contact() {
  const classes = useStyles();
  const { data, loading, error } = useActiveUserQuery();
  const [openPhoto, setOpenPhoto] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  if (loading) return <LinearProgress />;
  if (error) return <span>error</span>;
  if (data)
    return (
      <Container maxWidth="lg" className={classes.container}>
        {!openEdit ? (
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Fab
                color="primary"
                aria-label="edit contact"
                className={classes.fab}
                size="small"
                onClick={() => setOpenEdit(true)}
              >
                <EditIcon />
              </Fab>
              <Grid item>
                {loading ? (
                  <Skeleton variant="circle" className={classes.avatar} />
                ) : (
                  <UserProfileAvatar
                    onClick={() => setOpenPhoto(true)}
                    size="large"
                  />
                )}
              </Grid>
              {openPhoto && <PhotoForm setOpen={() => setOpenPhoto(false)} />}
              <Grid item xs container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item>
                    {loading ? (
                      <Skeleton height={10} width="40%" />
                    ) : (
                      <Typography variant="h5" paragraph>
                        {data && data.activeUser.fullName}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item xs>
                      <Typography variant="caption" color="textSecondary">
                        E-Posta Adresi
                      </Typography>
                      {loading ? (
                        <Skeleton height={10} width="41%" />
                      ) : (
                        <Typography
                          variant="body1"
                          className={classes.type}
                          paragraph
                        >
                          {data && data.activeUser.email}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        Telefon
                      </Typography>
                      {loading ? (
                        <Skeleton height={10} width="46%" />
                      ) : (
                        <Typography variant="body1" className={classes.type}>
                          {(data && data.activeUser.phone) || "-"}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs>
                      <Typography variant="caption" color="textSecondary">
                        Adres
                      </Typography>
                      {loading ? (
                        <Skeleton height={10} width="35%" />
                      ) : (
                        <Typography
                          variant="body2"
                          className={classes.type}
                          paragraph
                        >
                          {data && "Address düzenlencek"}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        Doğum Tarihi
                      </Typography>
                      {loading ? (
                        <Skeleton height={10} width="45%" />
                      ) : (
                        <Typography variant="body1" className={classes.type}>
                          {(data &&
                            data.activeUser.birthDate &&
                            DateTime.fromISO(
                              data.activeUser.birthDate.toString()
                            ).toISODate()) ||
                            "-"}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Edit variables={data.activeUser} close={() => setOpenEdit(false)} />
        )}
      </Container>
    );
  return <span></span>;
}
