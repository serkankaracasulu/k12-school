import * as React from "react";

import {
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { People as PeopleIcon } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import {
  TeacherApplicationsDocument,
  TeacherApplicationsQuery,
  TeacherApplicationsQueryVariables,
  useApplicatonUpdatedSubscription,
  useTeacherApplicationsQuery,
} from "../generated/graphql";
import DropDown from "./DropDown/DropDown";
import DropDownItem from "./DropDown/DropDownItem";
import DropDownList from "./DropDown/DropDownList";
import { SnackBarProp } from "./myTypes";
import Snackbar from "./SnackBar";
import teacherApplicationMutate from "./teacherApplicationMutate";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "white",
  },
  button: {
    width: "max-content",
    marginLeft: theme.spacing(1),
    textTransform: "capitalize",
  },
  actionContent: {
    display: "flex",
  },
  institutionName: {
    maxWidth: "250px",
    marginRight: theme.spacing(3),
  },
  noInvitation: {
    backgroundColor: theme.palette.grey[100],
  },
  fixedWidth: {
    width: "130px",
  },
}));

export default function () {
  const [displayMenu, setDisplayMenu] = React.useState(false);
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const classes = useStyles();
  const { data } = useTeacherApplicationsQuery();
  useApplicatonUpdatedSubscription({
    onSubscriptionData: (tData) => {
      if (tData.subscriptionData.data) {
        const newItem = tData.subscriptionData.data.applicationUpdated;
        if (data) {
          if (data.teacherApplications.length > 0) {
            const otherApplications = data.teacherApplications.filter(
              (ta) => ta._id !== newItem._id
            );
            if (!otherApplications) {
              tData.client.writeQuery<
                TeacherApplicationsQuery,
                TeacherApplicationsQueryVariables
              >({
                query: TeacherApplicationsDocument,
                data: {
                  teacherApplications: [
                    { ...newItem, __typename: "TeacherApplication" },
                    otherApplications,
                  ],
                },
              });
            }
          }
        }
      }
    },
  });
  const [handleDelete, handleAddTeacher] = teacherApplicationMutate(
    setSnackBarProp
  );
  const readyToAcceptAplicatons =
    data && data.teacherApplications.filter((tp) => tp.status === 2);
  return (
    <>
      <DropDown
        onClose={() => setDisplayMenu(false)}
        open={displayMenu}
        button={
          <IconButton onClick={() => setDisplayMenu((o) => !o)}>
            <Badge
              badgeContent={
                readyToAcceptAplicatons ? readyToAcceptAplicatons.length : 0
              }
              color="secondary"
            >
              <PeopleIcon className={classes.icon} />
            </Badge>
          </IconButton>
        }
      >
        <DropDownList title="Öğretmen Başvuruları">
          {readyToAcceptAplicatons && readyToAcceptAplicatons.length > 0 ? (
            readyToAcceptAplicatons.map((ta) => (
              <DropDownItem key={ta._id}>
                <Typography
                  color="primary"
                  noWrap
                  className={classes.institutionName}
                >
                  {ta.userFullName}
                </Typography>
                <div className={classes.actionContent}>
                  <ButtonGroup>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      className={classes.button}
                      endIcon={<PersonAddIcon />}
                      onClick={() => handleAddTeacher(ta._id)}
                    >
                      Kabul Et
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      size="small"
                      className={classes.button}
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(ta._id)}
                    >
                      Kaldır
                    </Button>
                  </ButtonGroup>
                </div>
              </DropDownItem>
            ))
          ) : (
            <DropDownItem>
              <Typography color="textSecondary" noWrap>
                Öğretmen Başvurusu Yok
              </Typography>
            </DropDownItem>
          )}
        </DropDownList>
      </DropDown>
      <Snackbar pr={snackBarProp} setPr={setSnackBarProp} />
    </>
  );
}
