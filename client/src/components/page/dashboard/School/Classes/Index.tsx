import clsx from "clsx";
import * as pather from "path";
import * as React from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Add,
  Cancel,
  Delete as DeleteIcon,
  Done,
  Edit,
  LocalLibraryRounded as ClassIcon,
} from "@material-ui/icons";

import {
  ClassQuery,
  CreateClassInput,
  SchoolQuery,
  useCreateClassMutation,
  useSchoolQuery,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import Loading from "../../../../Loading";
import { SnackBarProp } from "../../../../myTypes";
import SnackBar from "../../../../SnackBar";
import ClassContex from "./ClassContex";
import ClassForm from "./ClassFrom";
import Classs from "./Classs";
import ClassroomTeacher from "./ClassTeacherEdit";
import DeleteClass from "./Delete";
import LessonsPage from "./Lessons/Index";
import messageBox from "./messageBox";
import schema from "./schema";
import StudentsPage from "./Students/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
    dialog: {
      margin: theme.spacing(1),
    },
    dialogContentText: {
      padding: theme.spacing(0, 1, 5, 1),
    },
    card: {
      maxWidth: 345,
      margin: theme.spacing(2),
      width: 250,
    },
    cardContent: {
      display: "flex",
      justifyContent: "space-around",
    },
    cardActions: {
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      display: "flex",
      justifyContent: "flex-end",
    },
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
    button: {
      margin: theme.spacing(0, 3, 3, 3),
    },
    cardPersonContent: {
      paddingBottom: 0,
    },
    typography: {
      padding: theme.spacing(2),
    },
    hourGroup: {
      minWidth: "150px",
      margin: theme.spacing(2, 2),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
      fontSize: "7rem",
    },
    icon: {
      marginLeft: theme.spacing(1),
    },
    popover: {
      display: "flex",
      justifyContent: "space-araund",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    addCard: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    avatar: {
      color: theme.palette.grey[600],
    },
    editAIcon: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    breadCrumb: {
      margin: theme.spacing(1, 0, 0, 1),
    },
  })
);

type PropsType = {
  school: SchoolQuery["school"];
};
type ParamType = {
  schoolId: string;
};
export function Index(props: PropsType) {
  const { schoolId } = useParams<ParamType>();
  const { url } = useRouteMatch();
  const { setClassName } = React.useContext(ClassContex);
  const { school } = props;
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteClass, setDeleteClass] = React.useState<
    ClassQuery["class"] | null
  >(null);
  const [updateClass, { loading: loadingClass }] = useCreateClassMutation({
    onCompleted: () => {
      generateSuccess(setSnackBarProp, messageBox);
      setUpdateValues({ _id: "", schoolId, level: 0 });
    },
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const classes = useStyles();
  const [looading, setLoading] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<CreateClassInput>({
    schoolId,
    level: 0,
  });
  const [updateValues, setUpdateValues] = React.useState<CreateClassInput>({
    schoolId,
    level: 0,
  });
  const handleDelete = (delClass: ClassQuery["class"]) => {
    setDeleteClass(delClass);
    setDeleteOpen(true);
  };
  const handleEdit = (classs: ClassQuery["class"]) => {
    setUpdateValues({
      _id: classs._id,
      schoolId,
      level: classs.level,
      code: classs.code,
      code1: classs.code1,
      name: classs.name,
    });
  };
  const handleUpdate = () => {
    const validateError = validate(updateValues, schema);
    if (validateError) {
      generateValidateError(setSnackBarProp, validateError);
      return;
    }
    updateClass({ variables: updateValues });
  };
  const [classroomId, setClassroomId] = React.useState("");
  const handleClassroomTeacherEdit = (id: string) => {
    setClassroomId(id);
  };
  const [isCreate, setIsCreate] = React.useState<boolean>(false);
  return (
    <Container maxWidth="lg" className={classes.container}>
      {looading && <Loading />}
      <Grid container justify="flex-start" spacing={3}>
        <Card className={clsx(classes.addCard, classes.card)}>
          <CardContent>
            {!isCreate ? (
              <IconButton
                aria-label="add school"
                onClick={() => setIsCreate(true)}
              >
                <Add
                  fontSize="large"
                  className={classes.extendedIcon}
                  color="primary"
                />
              </IconButton>
            ) : (
              <Classs
                values={values}
                setValues={setValues}
                schoolId={schoolId}
                setLoading={setLoading}
                open={() => setIsCreate(false)}
              />
            )}
          </CardContent>
        </Card>
        {school &&
          school.classes.map((classs) => (
            <Grid item key={classs._id}>
              <Card className={classes.card}>
                {updateValues._id !== classs._id ? (
                  <>
                    <CardHeader
                      avatar={<ClassIcon className={classes.avatar} />}
                      title={classs.fullName}
                      subheader={classs.name}
                    />
                    <Divider variant="middle" />
                    <CardContent className={classes.cardContent}>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Link
                          to={pather.join(url, classs._id, "students")}
                          component={RouterLink}
                          onClick={() => setClassName(classs.fullName)}
                        >
                          Öğrenci
                        </Link>

                        <Typography variant="h4" component="p">
                          {classs.studentCount}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Link
                          to={pather.join(
                            url || "",
                            classs._id || "",
                            "lessons"
                          )}
                          component={RouterLink}
                        >
                          Ders
                        </Link>
                        <Typography variant="h4" component="p">
                          {classs.lessonCount}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider variant="middle" />
                    <CardContent className={classes.cardPersonContent}>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        position="relative"
                      >
                        {classroomId === classs._id ? (
                          <>
                            <ClassroomTeacher
                              classId={classroomId}
                              setOpen={() => setClassroomId("")}
                            />
                          </>
                        ) : (
                          <>
                            <Tooltip
                              title="Sınıf öğretmenini değiştir"
                              className={classes.editAIcon}
                            >
                              <IconButton
                                onClick={() =>
                                  handleClassroomTeacherEdit(classs._id)
                                }
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Typography
                              variant="body2"
                              color="primary"
                              component="h3"
                            >
                              Sınıf Öğretmeni
                            </Typography>
                            <Typography variant="h6" component="p">
                              {classs.classroomTeacher
                                ? classs.classroomTeacher.fullName
                                : "Yok"}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </CardContent>
                    <Divider variant="middle" />
                    <CardContent className={classes.cardPersonContent}>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography
                          variant="body2"
                          color="primary"
                          component="h3"
                        >
                          Rehber Öğretmen
                        </Typography>
                        <Typography variant="h6" component="p">
                          Girilmedi
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider variant="middle" />
                    <CardContent className={classes.cardPersonContent}>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography
                          variant="body2"
                          color="primary"
                          component="h3"
                        >
                          Sınıf Başkanı
                        </Typography>
                        <Typography variant="h6" component="p">
                          Girilmedi
                        </Typography>
                      </Box>
                    </CardContent>
                  </>
                ) : (
                  <>
                    {loadingClass && <Loading />}
                    <CardContent className={classes.cardContent}>
                      <ClassForm
                        setValues={setUpdateValues}
                        values={updateValues}
                        schoolKindId={school ? school.schoolKindId : undefined}
                      />
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <IconButton
                        disabled={loadingClass}
                        onClick={() => setUpdateValues({ schoolId, level: 0 })}
                        aria-label="edit cancel"
                      >
                        <Cancel />
                      </IconButton>
                      <IconButton
                        disabled={loadingClass}
                        onClick={handleUpdate}
                        color="primary"
                        aria-label="edit done"
                      >
                        <Done />
                      </IconButton>
                    </CardActions>
                  </>
                )}

                <CardActions disableSpacing className={classes.cardActions}>
                  <Tooltip title="Sınıf sil">
                    <IconButton onClick={() => handleDelete(classs)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  {updateValues._id !== classs._id && (
                    <IconButton
                      onClick={() => handleEdit(classs)}
                      aria-label="edit school"
                    >
                      <Edit />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
      {deleteOpen && deleteClass && (
        <DeleteClass
          setOpen={() => setDeleteOpen(false)}
          classData={deleteClass}
          schoolId={schoolId}
        />
      )}
    </Container>
  );
}
export default function () {
  const { path, url } = useRouteMatch();
  const classes = useStyles();
  const [className, setClassName] = React.useState("");
  const { schoolId } = useParams<ParamType>();
  const { data, loading } = useSchoolQuery({
    variables: { id: schoolId },
  });
  return (
    <>
      <ClassContex.Provider value={{ className, setClassName }}>
        {loading && <LinearProgress />}
        <Breadcrumbs aria-label="className" className={classes.breadCrumb}>
          {data && (
            <Link
              component={RouterLink}
              color="textSecondary"
              to={url}
              onClick={() => setClassName("")}
            >
              {data.school.name}
            </Link>
          )}
          <Typography component="span" color="textSecondary">
            {className}
          </Typography>
        </Breadcrumbs>
        <Switch>
          {data && (
            <Route exact path={path}>
              <Index school={data.school} />
            </Route>
          )}
          <Route path={pather.join(path, ":classId", "students")}>
            <StudentsPage />
          </Route>
          <Route path={pather.join(path, ":classId", "lessons")}>
            <LessonsPage />
          </Route>
        </Switch>
      </ClassContex.Provider>
    </>
  );
}
