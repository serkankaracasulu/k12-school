import clsx from "clsx";
import * as React from "react";

import { Badge, Button, IconButton, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import WorkIcon from "@material-ui/icons/Work";

import {
  DriverJobRequestsDocument,
  DriverJobRequestsQuery,
  DriverJobRequestsQueryVariables,
  useApplicatonUpdatedSubscription,
  useDriverJobRequestsQuery,
} from "../generated/graphql";
import jobInvitationMutate from "./driverjobInvitationMutate";
import DropDown from "./DropDown/DropDown";
import DropDownItem from "./DropDown/DropDownItem";
import DropDownList from "./DropDown/DropDownList";
import { SnackBarProp } from "./myTypes";
import UserProfileAvatar from "./page/dashboard/UserAvatar";
import Snackbar from "./SnackBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    work: {
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
      alignItems: "flex-end",
      [theme.breakpoints.down("sm")]: {
        flexFlow: "row",
        justifyContent: "space-around",
        flexGrow: 1,
      },
    },
  })
);
export default function JobInvitation() {
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const classes = useStyles();
  const { data } = useDriverJobRequestsQuery();
  useApplicatonUpdatedSubscription({
    onSubscriptionData: (tData) => {
      if (tData.subscriptionData.data) {
        const newItem = tData.subscriptionData.data.applicationUpdated;
        if (data) {
          if (data.driverJobRequests.length > 0) {
            const otherS = data.driverJobRequests.filter(
              (j) => j._id !== newItem._id
            );

            tData.client.writeQuery<
              DriverJobRequestsQuery,
              DriverJobRequestsQueryVariables
            >({
              query: DriverJobRequestsDocument,
              data: {
                driverJobRequests: [
                  { ...newItem, __typename: "DriverApplication" },
                  ...otherS,
                ],
              },
            });
          } else {
            tData.client.writeQuery<
              DriverJobRequestsQuery,
              DriverJobRequestsQueryVariables
            >({
              query: DriverJobRequestsDocument,
              data: {
                driverJobRequests: [
                  { ...newItem, __typename: "DriverApplication" },
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
  const handleAccept = jobInvitationMutate(setSnackBarProp);
  return (
    <>
      <DropDown
        open={displayMenu}
        onClose={() => setDisplayMenu(false)}
        button={
          <IconButton onClick={() => setDisplayMenu((o) => !o)}>
            <Badge
              badgeContent={data && data.driverJobRequests.length}
              color="secondary"
            >
              <WorkIcon className={classes.work} />
            </Badge>
          </IconButton>
        }
      >
        <DropDownList title="Sürücü İş İstekleri">
          {data &&
            data.driverJobRequests.map((j) => (
              <DropDownItem key={j._id}>
                <UserProfileAvatar size="small" personId={j.userId} />
                <div className={classes.contentContainer}>
                  <Typography
                    color="primary"
                    noWrap
                    gutterBottom
                    className={classes.institutionName}
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
                        onClick={() => handleAccept(j._id, false, true)}
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
                        onClick={() => handleAccept(j._id, true)}
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
          {data && data.driverJobRequests.length === 0 && (
            <DropDownItem className={classes.noInvitation}>
              <Typography color="textSecondary" noWrap>
                Bekleyen İş davetiyesi yok
              </Typography>
            </DropDownItem>
          )}
        </DropDownList>
      </DropDown>
      <Snackbar pr={snackBarProp} setPr={setSnackBarProp} />
    </>
  );
}
