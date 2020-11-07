/* eslint-disable react/prop-types */
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import {
  ParentsDocument,
  ParentsQuery,
  ParentsQueryVariables,
  useAddParentMutation,
  useParentApplicationsQuery,
} from "../../../../../generated/graphql";
import { RouterCons } from "../../../../Routers";
import UserProfileAvatar from "../../UserAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexWrap: "wrap",
      display: "flex",
    },
    listItem: {
      width: 300,
      marginRight: theme.spacing(3),
    },
    listItemIcon: {
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "",
    },
  })
);

interface IParentApplicationsPageProps {
  studentId: string;
}

const ParentApplicationsPage: React.FC<IParentApplicationsPageProps> = ({
  studentId,
}) => {
  const classes = useStyles();
  const { data, loading } = useParentApplicationsQuery({
    variables: { studentId },
  });
  const [addParent] = useAddParentMutation({
    onError: () => {},
  });
  const handleDelete = (requestId: string) => {};
  const handleAccept = (requestId: string) => {
    addParent({
      variables: { applicationId: requestId },
      update: (proxy, result) => {
        if (!result.data) return;
        const { addParent } = result.data;
        const parents = proxy.readQuery<ParentsQuery, ParentsQueryVariables>({
          query: ParentsDocument,
          variables: { studentId },
        });
        if (!parents) return;
        proxy.writeQuery<ParentsQuery, ParentsQueryVariables>({
          query: ParentsDocument,
          variables: { studentId },
          data: { studentParents: [addParent, ...parents.studentParents] },
        });
      },
    });
  };
  if (loading) return <LinearProgress />;
  if (data)
    return (
      <List className={classes.root}>
        {data.parentApplications.map((app) => (
          <ListItem key={app._id} className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <UserProfileAvatar personId={app.userId} />
            </ListItemIcon>
            <ListItemText
              primary={
                app.userId && (
                  <Link
                    component={RouterLink}
                    to={RouterCons.myschools.user.userId(app.userId, true)}
                  >
                    {app.userFullName}
                  </Link>
                )
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    color="textPrimary"
                    variant="body2"
                  >
                    {app.email}{" "}
                  </Typography>
                  {getStatus(app.status)}
                </>
              }
            />
            <ListItemSecondaryAction className={classes.actionsContainer}>
              {app.status === 2 && (
                <Tooltip title="Ekle">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleAccept(app._id)}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Sil">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(app._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  return <span></span>;
};
export default ParentApplicationsPage;
function getStatus(status: number) {
  switch (status) {
    case 0:
      return "Hesap oluşturması için e-mail gönderildi.";
    case 1:
      return "Kullanıcıya davet gönderildi ";
    case 2:
      return "Kullanıcı isteği kabul etti";
    default:
      return "";
  }
}
