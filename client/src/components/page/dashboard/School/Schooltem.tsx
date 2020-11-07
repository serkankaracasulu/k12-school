import * as pather from "path";
import * as React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Cancel,
  Delete as DeleteIcon,
  Details,
  Edit,
  EditLocation as MapIcon,
  PriorityHigh,
  SchoolRounded as SchoolIcon,
} from "@material-ui/icons";

import {
  EducationYearFragment,
  SchoolFragment,
} from "../../../../generated/graphql";
import DeleteSchool from "./Delete";
import EditSchool from "./EditSchool";
import EducationYearDialog from "./EducationYear/Index";
import Hour from "./Hour/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
    button: {
      marginLeft: theme.spacing(1),
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    card: {
      maxWidth: 345,
      margin: theme.spacing(2),
      width: 250,
    },
    cardActions: {
      padding: theme.spacing(0),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      display: "flex",
      justifyContent: "flex-end",
    },
    cardContent: {
      display: "flex",
      justifyContent: "space-around",
    },
    cardPersonContent: {
      paddingBottom: theme.spacing(0),
    },
    center: {
      display: "flex",
      justifyContent: "",
    },
    fixed: {
      height: 240,
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
      fontSize: "7rem",
    },
    addCard: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardTitle: {
      textTransform: "capitalize",
    },
    avatar: {
      color: theme.palette.grey[600],
    },
  })
);
type TypeProps = {
  school: SchoolFragment;
};

export default function SchoolItem({ school }: TypeProps) {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const [educationYears, setEducationYears] = React.useState<
    EducationYearFragment[]
  >();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openHour, setOpenHour] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const handleEdit = () => {
    setIsEdit(true);
  };
  const handleCancel = () => {
    setIsEdit(false);
  };
  const handleDelete = () => {
    setOpenDelete(true);
  };
  return (
    <>
      <Card className={classes.card}>
        {isEdit ? (
          <EditSchool school={school} onClose={handleCancel} />
        ) : (
          <CardHeader
            action={+school._id < 0 ? <CircularProgress /> : ""}
            avatar={
              <SchoolIcon aria-label="recipe" className={classes.avatar} />
            }
            title={school.name}
            subheader={school.schoolKindName}
          />
        )}

        <Divider variant="middle" />
        <CardContent className={classes.cardContent}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Box display="flex" alignItems="center" flexDirection="column">
              <Link
                to={pather.join(url, school._id, "classes")}
                component={RouterLink}
              >
                Sınıf
              </Link>

              <Typography variant="h4" component="p">
                {school.classes.length}
              </Typography>
            </Box>
            <Typography variant="h4" component="p" />
          </Box>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Link
              to={pather.join(url, school._id, "students")}
              component={RouterLink}
            >
              Öğrenci
            </Link>
            <Typography variant="h4" component="p">
              {school.studentCount}
            </Typography>
          </Box>
        </CardContent>
        <Divider variant="middle" />
        <CardContent className={classes.cardContent}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="primary" component="h3">
              Eğtim Dönemleri
            </Typography>
            <IconButton
              onClick={() => setEducationYears(school.educationYears)}
              aria-label="open education year"
            >
              {school.educationYears.length > 0 ? (
                <Details />
              ) : (
                <PriorityHigh />
              )}
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="primary" component="h3">
              Saat
            </Typography>
            <IconButton
              onClick={() => setOpenHour(true)}
              aria-label="open hours"
            >
              {school.weeklyHour ? <Details /> : <PriorityHigh />}
            </IconButton>
          </Box>
        </CardContent>
        <Divider variant="middle" />
        <CardContent className={classes.cardPersonContent}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="primary" component="h3">
              Müdür
            </Typography>
            <Typography variant="h6" component="p" />
          </Box>
        </CardContent>
        <CardActions disableSpacing className={classes.cardActions}>
          {url && (
            <IconButton
              to={pather.join(url, school._id, "address")}
              component={RouterLink}
            >
              <MapIcon />
            </IconButton>
          )}
          <IconButton onClick={handleDelete} aria-label="delete school">
            <DeleteIcon />
          </IconButton>
          {isEdit ? (
            <IconButton onClick={handleCancel} aria-label="edit cancel">
              <Cancel />
            </IconButton>
          ) : (
            <IconButton onClick={handleEdit} aria-label="edit school">
              <Edit />
            </IconButton>
          )}
        </CardActions>
      </Card>
      {openHour && (
        <Hour setOpen={() => setOpenHour(false)} schoolId={school._id} />
      )}
      {educationYears && (
        <EducationYearDialog
          close={() => setEducationYears(undefined)}
          schoolId={school._id}
          educationYears={educationYears}
        />
      )}
      {openDelete && (
        <DeleteSchool school={school} setOpen={() => setOpenDelete(false)} />
      )}
    </>
  );
}
