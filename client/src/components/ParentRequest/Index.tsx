import clsx from "clsx";
import * as React from "react";

import { Badge, Button, IconButton, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ChildCareIcon from "@material-ui/icons/ChildCare";

import {
  MyParentApplicationsDocument,
  MyParentApplicationsQuery,
  MyParentApplicationsQueryVariables,
  useAcceptInvitationMutation,
  useApplicatonUpdatedSubscription,
  useMyParentApplicationsQuery,
} from "../../generated/graphql";
import DropDown from "../DropDown/DropDown";
import DropDownItem from "../DropDown/DropDownItem";
import DropDownList from "../DropDown/DropDownList";
import { SnackBarProp } from "../myTypes";
import UserProfileAvatar from "../page/dashboard/UserAvatar";
import Snackbar from "../SnackBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    text: {
      maxWidth: "250px",
      alignSelf: "center",
    },
    noInvitation: {
      backgroundColor: theme.palette.grey[100],
    },
    fixedWidth: {
      width: "150px",
    },
    profileAvatar: {
      marginRight: theme.spacing(1),
    },
    contentContainer: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-start",
      [theme.breakpoints.down("sm")]: {
        flexFlow: "row",
        justifyContent: "space-around",
        flexGrow: 1,
      },
      "&> *": {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
  })
);
export default function ParentRequestPage() {
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const classes = useStyles();
  const [acceptRequest] = useAcceptInvitationMutation({
    onError: (cError) => {},
  });
  const { data } = useMyParentApplicationsQuery();
  useApplicatonUpdatedSubscription({
    onSubscriptionData: (tData) => {
      if (tData.subscriptionData.data) {
        const newItem = {
          ...tData.subscriptionData.data.applicationUpdated,
          studentId: "",
        };
        if (data) {
          if (data.myParentApplications.length > 0) {
            const otherS = data.myParentApplications.filter(
              (j) => j._id !== newItem._id
            );
            tData.client.writeQuery<
              MyParentApplicationsQuery,
              MyParentApplicationsQueryVariables
            >({
              query: MyParentApplicationsDocument,
              data: {
                myParentApplications: [
                  { ...newItem, __typename: "ParentApplication" },
                  ...otherS,
                ],
              },
            });
          } else {
            tData.client.writeQuery<
              MyParentApplicationsQuery,
              MyParentApplicationsQueryVariables
            >({
              query: MyParentApplicationsDocument,
              data: {
                myParentApplications: [
                  { ...newItem, __typename: "ParentApplication" },
                ],
              },
            });
          }
        }
      }
    },
  });
  const [buttonValue, setButtonValue] = React.useState("İstek Kabul Edildi");
  const [displayMenu, setDisplayMenu] = React.useState(false);
  const handleAccept = (invitationId: string) => {
    acceptRequest({
      variables: { invitationId },
    });
  };
  const handleDelete = (invitationId: string, r?: boolean) => {
    acceptRequest({
      variables: { invitationId, d: r ? false : true, r },
      update: (proxy, result) => {
        if (result.data && data) {
          const { acceptInvitation } = result.data;
          const updatedData = data.myParentApplications.filter(
            (re) => re._id !== acceptInvitation._id
          );
          proxy.writeQuery<
            MyParentApplicationsQuery,
            MyParentApplicationsQueryVariables
          >({
            query: MyParentApplicationsDocument,
            data: { myParentApplications: updatedData },
          });
        }
      },
    });
  };
  return (
    <>
      <DropDown
        open={displayMenu}
        onClose={() => setDisplayMenu(false)}
        button={
          <IconButton onClick={() => setDisplayMenu((o) => !o)}>
            <Badge
              badgeContent={data && data.myParentApplications.length}
              color="secondary"
            >
              <ChildCareIcon className={classes.icon} />
            </Badge>
          </IconButton>
        }
      >
        <DropDownList title="Veli İstekleri">
          {data &&
            data.myParentApplications.map((j) => (
              <DropDownItem key={j._id}>
                <UserProfileAvatar size="small" personId={j.userId} />
                <div className={classes.contentContainer}>
                  <Typography
                    color="primary"
                    noWrap
                    gutterBottom
                    className={classes.text}
                  >
                    {j.studentFullName}
                  </Typography>
                  <Typography
                    className={classes.text}
                    color="textSecondary"
                    variant="caption"
                    gutterBottom
                  >
                    {j.institutionName}
                  </Typography>
                  {j.status === 1 && (
                    <div className={classes.actionContent}>
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => handleAccept(j._id)}
                        className={classes.button}
                      >
                        Kabul Et
                      </Button>
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        className={classes.button}
                        onClick={() => handleDelete(j._id)}
                      >
                        Kaldır
                      </Button>
                    </div>
                  )}
                  {j.status === 2 && (
                    <div className={classes.actionContent}>
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={() => handleDelete(j._id, true)}
                        className={clsx(classes.button, classes.fixedWidth)}
                        onMouseEnter={() => {
                          setButtonValue("İptal Et");
                        }}
                        onMouseLeave={() => {
                          setButtonValue("Başvuru Gönderildi");
                        }}
                      >
                        {buttonValue}
                      </Button>
                    </div>
                  )}
                </div>
              </DropDownItem>
            ))}
          {data && data.myParentApplications.length === 0 && (
            <DropDownItem className={classes.noInvitation}>
              <Typography color="textSecondary" noWrap>
                Bekleyen veli isteği yok
              </Typography>
            </DropDownItem>
          )}
        </DropDownList>
      </DropDown>
      <Snackbar pr={snackBarProp} setPr={setSnackBarProp} />
    </>
  );
}
