import * as React from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Fab,
  Grid,
  IconButton,
  InputBase,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import EditTCIcon from "@material-ui/icons/EditAttributes";

import {
  AddStudentMutationVariables,
  EditStudentCitizenshipIdMutationVariables,
  useStudentQuery,
  useStudentResetPasswordMutation,
} from "../../../../generated/graphql";
import SendMessageButton from "../../../SendMessageButton";
import StudentAvatar from "../StudentAvatar";
import StudentEdit from "../Students/Add";
import EditTCform from "./EditCitizenShip";
import ParentList from "./Parent/Index";
import ParentInvitationPage from "./Parent/Invitation";
import ParentApplicationsPage from "./ParentApplications/Index";

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
    avatar: {
      width: 150,
      height: 150,
      marginLeft: "auto",
      marginRight: "auto",
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

type PropsType = {
  studentId: string;
};
interface ResetPassword {
  resetStudentPassword: {
    password: string;
  };
}
type ResetPassworTvariables = {
  studentId: string;
};
export function StudentPage(props: PropsType) {
  const { studentId } = props;
  const [openAddParent, setOpenAddParent] = React.useState(false);
  const [
    openEditTc,
    setOpenEditTc,
  ] = React.useState<EditStudentCitizenshipIdMutationVariables | void>();
  const [
    editStudent,
    setEditStudent,
  ] = React.useState<AddStudentMutationVariables | void>();
  const { data, loading, error, refetch } = useStudentQuery({
    variables: { studentId },
  });

  const [
    resetPassword,
    { data: dataPassword, loading: loadingPassword },
  ] = useStudentResetPasswordMutation({ onError: () => {} });

  const handleResetPassword = () => {
    resetPassword({ variables: { studentId } });
  };
  const classes = useStyles();
  if (loading) return <LinearProgress />;
  if (error) return <div>Hata</div>;
  if (data) {
    const { student } = data;
    return (
      <>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xl={4} lg={3} xs={12}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Öğrenci
                    </Typography>
                    <div>
                      {student ? (
                        <StudentAvatar
                          studentId={student._id}
                          size="large"
                          center
                        />
                      ) : (
                        <Avatar />
                      )}
                    </div>

                    <CardHeader
                      title={student.fullName}
                      subheader={student.citizenshipId}
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        component="p"
                        color="textSecondary"
                      >
                        {"Yabancı Dil : "}
                        <Typography component="span" color="textPrimary">
                          {student.foreignLanguage}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        color="textSecondary"
                      >
                        {"Okul No: "}
                        <Typography component="span" color="textPrimary">
                          {student.schoolNo}
                        </Typography>
                      </Typography>
                    </CardContent>

                    <CardActions disableSpacing>
                      <SendMessageButton to={student._id} />
                      <IconButton
                        onClick={() =>
                          setOpenEditTc({
                            studentId: student._id,
                            citizenshipId: student.citizenshipId,
                          })
                        }
                      >
                        <EditTCIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Okul Bilgileri
                    </Typography>
                    <CardHeader
                      title={student.schoolName || "Okula kayıtlı değil"}
                      subheader={student.className || "Sınıfa kayıtlı değil"}
                    />
                  </Card>
                </Grid>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Kullanıcı Giriş
                    </Typography>
                    <CardContent>
                      {loadingPassword && (
                        <LinearProgress style={{ margin: "8px" }} />
                      )}
                      <Typography gutterBottom>
                        Kullanıcı Adı: {student.username}
                      </Typography>
                      <InputBase
                        type={dataPassword ? "text" : "password"}
                        value={
                          dataPassword?.resetStudentPassword.password ||
                          "thisisnotrealpassword"
                        }
                        disabled={!dataPassword}
                      />
                    </CardContent>
                    <CardActions disableSpacing>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleResetPassword}
                        disabled={loadingPassword}
                      >
                        ŞİFRE SIFIRLA
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} xl={8} lg={9}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Veli Davetiyeler
                    </Typography>
                    <ParentApplicationsPage studentId={studentId} />
                  </Card>
                </Grid>
                <Grid item>
                  <Card>
                    <Typography variant="h6" className={classes.cardHeader}>
                      Veliler
                    </Typography>
                    <CardContent>
                      <ParentList />
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => setOpenAddParent(true)}
                      >
                        VELİ EKLE
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {openAddParent && (
            <ParentInvitationPage
              studentId={student._id}
              close={() => setOpenAddParent(false)}
            />
          )}
        </Container>
        <Fab
          aria-label="Edit"
          className={classes.edit}
          color="primary"
          onClick={() =>
            setEditStudent({
              firstName: data.student.firstName,
              lastName: data.student.lastName,
              citizenshipId: data.student.citizenshipId,
              schoolNo: data.student.schoolNo,
            })
          }
        >
          <EditIcon />
        </Fab>
        {editStudent && (
          <StudentEdit
            student={editStudent}
            setOpen={() => setEditStudent()}
            refetch={refetch}
          />
        )}
        {openEditTc && (
          <EditTCform
            refetch={refetch}
            setOpen={() => setOpenEditTc()}
            iVariables={openEditTc}
          />
        )}
      </>
    );
  }

  return <div />;
}

type ParamType = {
  studentId: string;
};

export default function Index() {
  const { path } = useRouteMatch();
  const { studentId } = useParams<ParamType>();
  return (
    <Switch>
      <Route exact path={path}>
        {studentId && <StudentPage studentId={studentId} />}
      </Route>
      <Redirect to={path} />
    </Switch>
  );
}
