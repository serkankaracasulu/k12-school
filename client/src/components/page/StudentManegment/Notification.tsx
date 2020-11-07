import { DateTime } from "luxon";
import * as pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Badge, Divider, IconButton, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Notifications as NotificationsIcon } from "@material-ui/icons/";

import {
  NotificationFragment,
  StudentNotificationAction,
  StudentNotificationsDocument,
  StudentNotificationsQuery,
  StudentNotificationsQueryVariables,
  StudentNotificationsStatusUpdateMutationVariables,
  StudentNotificationState,
  StudentNotificationType,
  useStudentNotificationsQuery,
  useStudentNotificationsStatusUpdateMutation,
  useStudentNotificationUpdatedSubscription,
} from "../../../generated/graphql";
import Context from "../../Context";
import DropDown from "../../DropDown/DropDown";
import DropDownItem from "../../DropDown/DropDownItem";
import DropDownList from "../../DropDown/DropDownList";

const useStyles = makeStyles((theme: Theme) => ({
  noData: {
    backgroundColor: theme.palette.grey[100],
    height: "auto",
  },
  link: {
    maxWidth: "60px",
  },
  action: {
    color: theme.palette.primary.main,
  },
  unread: { backgroundColor: blue[50] },
  button: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "pointer",
  },
}));
export default function Notification() {
  const { url } = useRouteMatch();
  const classes = useStyles();
  const { studentIndex } = React.useContext(Context);
  const history = useHistory();
  const [updateNotifications] = useStudentNotificationsStatusUpdateMutation();
  const { data, fetchMore } = useStudentNotificationsQuery({
    variables: studentIndex ? { parentStudentId: studentIndex } : {},
  });
  useStudentNotificationUpdatedSubscription({
    onSubscriptionData: (tData) => {
      if (tData.subscriptionData.data) {
        const { studentNotificationUpdated } = tData.subscriptionData.data;
        if (data) {
          if (data.studentNotifications.length > 0) {
            const otherS = data.studentNotifications.filter(
              (sn) => sn._id !== studentNotificationUpdated._id
            );

            tData.client.writeQuery<
              StudentNotificationsQuery,
              StudentNotificationsQueryVariables
            >({
              query: StudentNotificationsDocument,
              data: {
                studentNotifications: [studentNotificationUpdated, ...otherS],
              },
            });
          } else {
            tData.client.writeQuery<
              StudentNotificationsQuery,
              StudentNotificationsQueryVariables
            >({
              query: StudentNotificationsDocument,
              data: { studentNotifications: [studentNotificationUpdated] },
            });
          }
        }
      }
    },
  });

  const handleDisplayMenu = () => {
    setDisplayMenu(!displayMenu);
  };
  const handleUpdateNotifications = (
    variables: StudentNotificationsStatusUpdateMutationVariables
  ) => {
    updateNotifications({
      variables,
      update: (proxy, cache) => {
        const result =
          cache.data && cache.data.studentNotificationsStatusUpdate;

        if (result && data) {
          const updatedResult = data.studentNotifications.map((sn) => {
            if (result._ids.some((i) => i === sn._id))
              return { ...sn, state: variables.state };
            return sn;
          });
          if (updatedResult) {
            proxy.writeQuery<
              StudentNotificationsQuery,
              StudentNotificationsQueryVariables
            >({
              query: StudentNotificationsDocument,
              data: { studentNotifications: updatedResult },
            });
          }
        }
      },
    });
  };
  const [displayMenu, setDisplayMenu] = React.useState(false);
  const handleFetchMore = () => {
    fetchMore({
      variables: { skip: data ? data.studentNotifications.length : 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          studentNotifications: [
            ...prev.studentNotifications,
            ...fetchMoreResult.studentNotifications,
          ],
        };
      },
    });
  };
  const handleClose = () => {
    if (data) {
      const ids = data.studentNotifications
        .filter((sn) => sn._id && sn.state === StudentNotificationState.Unread)
        .map((sn) => sn._id);
      const variables: StudentNotificationsStatusUpdateMutationVariables = {
        state: StudentNotificationState.Seen,
        ids,
      };
      ids && ids.length > 0 && handleUpdateNotifications(variables);
    }
    setDisplayMenu(false);
  };
  const handleClick = (notification: NotificationFragment) => {
    const variables: StudentNotificationsStatusUpdateMutationVariables = {
      state: StudentNotificationState.Read,
      ids: [notification._id],
    };
    notification.state !== StudentNotificationState.Read &&
      handleUpdateNotifications(variables);
    setDisplayMenu(!displayMenu);
    if (notification.lessonId && notification.targetId) {
      const pathEnd = pather.join(
        notification.notificationType ===
          StudentNotificationType.Announcement ||
          notification.notificationType === StudentNotificationType.Homework
          ? "information"
          : notification.notificationType.toString(),
        notification.targetId
      );
      if (notification.notificationType === StudentNotificationType.Absence) {
        history.push(pather.join(url, pathEnd));
      } else
        history.push(
          pather.join(url, "lessons", notification.lessonId, pathEnd)
        );
    }
  };
  return (
    <DropDown
      open={displayMenu}
      onClose={handleClose}
      button={
        <IconButton onClick={handleDisplayMenu} color="inherit" tabIndex={0}>
          <Badge
            badgeContent={
              data
                ? data.studentNotifications.filter(
                    (sn) => sn.state === StudentNotificationState.Unread
                  ).length
                : 0
            }
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      }
    >
      <DropDownList title="Bildirimler" onBottom={handleFetchMore}>
        <DropDownItem onClick={handleFetchMore} button>
          <Typography variant="body2" className={classes.action}>
            Diğerleri
          </Typography>
        </DropDownItem>
        {data &&
          data.studentNotifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <DropDownItem
                className={
                  notification.state !== StudentNotificationState.Read
                    ? classes.unread
                    : undefined
                }
                button
                onClick={() => handleClick(notification)}
              >
                {notification.lessonName && (
                  <>
                    <Typography component="span" variant="caption">
                      <b>{notification.lessonName}</b>
                    </Typography>{" "}
                    <Typography component="span" variant="caption">
                      dersinde
                    </Typography>{" "}
                  </>
                )}

                <Typography
                  color="textPrimary"
                  component="span"
                  variant="caption"
                >
                  {getNotificationText(notification)}
                </Typography>

                {notification.message && (
                  <Typography
                    className={classes.link}
                    component="span"
                    variant="caption"
                  >
                    {": "} &quot;<b>{notification.message}</b> &quot;
                  </Typography>
                )}
              </DropDownItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        {data && data.studentNotifications.length === 0 && (
          <DropDownItem className={classes.noData}>
            <Typography color="textSecondary" noWrap>
              Duyuru yok
            </Typography>
          </DropDownItem>
        )}
      </DropDownList>
    </DropDown>
  );
}

function getNotificationText(notification: NotificationFragment) {
  const { notificationType, action } = notification;
  switch (notificationType) {
    case StudentNotificationType.Announcement:
      return "yeni ders duyurusu var";
    case StudentNotificationType.Homework:
      return "yeni ödev var";
    case StudentNotificationType.Exam:
      switch (action) {
        case StudentNotificationAction.Insert:
          return "yeni sınav var";
        case StudentNotificationAction.Update:
          return "sınav güncellendi";
        case StudentNotificationAction.Delete:
          return "bir sınav iptal edildi";
        default:
          return "";
      }
    case StudentNotificationType.Absence:
      var date = DateTime.fromISO(notification.createdAt).toUTC();
      return `${date.toFormat("yyyy LL dd T")} tarihinde devamsızlık yapıldı`;
    default:
      return "duyuru";
  }
}
