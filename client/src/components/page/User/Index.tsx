import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import { useUserQuery } from "../../../generated/graphql";
import SendMessageButton from "../../SendMessageButton";
import UserProfileAvatar from "../dashboard/UserAvatar";
import CalenderTeacher from "../teacherManegment/CalenderTeacher";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(2),
        margin: 0,
      },
    },
    edit: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        bottom: theme.mixins.toolbar.minHeight
          ? +theme.mixins.toolbar.minHeight + theme.spacing(2)
          : 0,
      },
    },
    cardHeader: {
      margin: theme.spacing(1, 0, 0, 1),
    },
  })
);

type RouteType = {
  userId: string;
};
export default function UserPage() {
  const { userId } = useParams<RouteType>();
  const { data, loading, error } = useUserQuery({ variables: { userId } });

  const classes = useStyles();
  if (loading) return <LinearProgress />;
  if (error) return <div>Hata</div>;
  if (data) {
    const { user } = data;
    return (
      <>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xl={4} lg={3} xs={12}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      {user.teacher && "Öğretmen"}
                      {user.driver && "Sürücü"}
                      {user.parentStudents.length > 0 && "Veli"}
                    </Typography>
                    <div>
                      <UserProfileAvatar
                        personId={userId}
                        size="large"
                        center
                      />
                    </div>
                    <CardHeader
                      title={user.fullName}
                      subheader={user.citizenshipId}
                    />
                    <CardActions disableSpacing>
                      <SendMessageButton to={user._id} />
                    </CardActions>
                  </Card>
                </Grid>
                {user.teacher && (
                  <Grid item>
                    <Card>
                      <Typography variant="h6" className={classes.cardHeader}>
                        Öğretmen Bilgileri
                      </Typography>
                      <CardHeader
                        title={user.teacher.allSchool ? "Bütün okullar" : ""}
                      />
                    </Card>
                  </Grid>
                )}
                {user.driver && (
                  <Grid item>
                    <Card>
                      <Typography variant="h6" className={classes.cardHeader}>
                        Sürücü Bilgileri
                      </Typography>
                      <CardHeader
                        title={"Okula kayıtlı değil"}
                        subheader={"Sınıfa kayıtlı değil"}
                      />
                    </Card>
                  </Grid>
                )}
                {user.driver && (
                  <Grid item>
                    <Card>
                      <Typography variant="h6" className={classes.cardHeader}>
                        Okul servis Sürücüsü
                      </Typography>
                      <CardHeader
                        title={user.driver.institutions
                          .map((i) => i.institutionName)
                          .join(",")}
                      />
                    </Card>
                  </Grid>
                )}
                {user.parentStudents.length > 0 && (
                  <Grid item>
                    <Card>
                      <Typography variant="h6" className={classes.cardHeader}>
                        Veli Bilgileri
                      </Typography>
                      <CardHeader
                        title={"Okula kayıtlı değil"}
                        subheader={"Sınıfa kayıtlı değil"}
                      />
                    </Card>
                  </Grid>
                )}
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Email
                    </Typography>
                    <CardContent>
                      <Typography gutterBottom>{user.email}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {user.phone && (
                  <Grid item>
                    <Card>
                      <Typography variant="h6" className={classes.cardHeader}>
                        Telefon
                      </Typography>
                      <CardContent>
                        <Typography gutterBottom>{user.phone}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} xl={8} lg={9}>
              <Card>
                <Typography variant="h6" className={classes.cardHeader}>
                  Birşeyler
                </Typography>
                <CardContent>
                  <div />
                </CardContent>
                <CardActions>
                  <Button startIcon={<AddIcon />} variant="contained">
                    EKLE
                  </Button>
                </CardActions>
              </Card>
              {user.teacher && (
                <div style={{ height: 500 }}>
                  <CalenderTeacher teacherId={user._id} />
                </div>
              )}
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return <div />;
}
