import clsx from "clsx";
import * as pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  BookRounded as LessonIcon,
  CalendarTodayRounded as Calendar,
} from "@material-ui/icons";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import AbsenceIcon from "@material-ui/icons/PersonAddDisabled";

import { useMyChildrenQuery } from "../../../generated/graphql";
import Context from "../../Context";
import ListItemLink from "../../ListItemLink";
import StudentAvatar from "../dashboard/StudentAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      marginLeft: theme.spacing(2),
    },
    border: {
      "&::before": {
        border: 0,
      },
    },
    icon: {
      display: "none",
    },
    studentItem: {
      width: `calc(100% - ${theme.spacing(2)}px)`,
    },
  })
);
const list: {
  primary: string;
  icon: React.ReactElement<any>;
  to?: string;
}[] = [
  {
    primary: "Göstergelerim",
    icon: <DashboardIcon />,
  },
  {
    to: "calendar",
    primary: "Ders programım",
    icon: <Calendar />,
  },
  {
    to: "lessons",
    primary: "Derslerim",
    icon: <LessonIcon />,
  },
  {
    to: "study",
    primary: "Etüt",
    icon: <BookmarkIcon />,
  },
  {
    to: "schoolvehicle",
    primary: "Okul taşıtı",
    icon: <DirectionsBusIcon />,
  },
];
export function MainListItems() {
  const { url } = useRouteMatch();
  const classes = useStyles();
  const { setStudentIndex, studentIndex } = React.useContext(Context);
  const { data } = useMyChildrenQuery();
  React.useEffect(() => {
    if (data) {
      setStudentIndex(data.myChildren[0]._id);
    }
  }, [data, setStudentIndex]);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStudentIndex(event.target.value as string);
  };
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(
    history.location.pathname
  );
  const handleSelect = (page: string) => {
    setSelectedPage(page);
  };
  return (
    <>
      <div>
        <FormControl
          fullWidth
          className={clsx(classes.item, classes.studentItem)}
        >
          <InputLabel>Öğrenci</InputLabel>
          <Select
            onChange={handleChange}
            value={studentIndex || ""}
            className={classes.border}
            classes={{
              icon: classes.icon,
            }}
          >
            {data &&
              data.myChildren.map((studentValue) => (
                <MenuItem value={studentValue._id} key={studentValue._id}>
                  <Box display="flex" alignItems="center">
                    <StudentAvatar studentId={studentValue._id} size="small" />
                    <Typography variant="body2" style={{ marginLeft: "8px" }}>
                      {studentValue.fullName}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {list.map((item) => (
          <ListItemLink
            key={item.primary}
            to={item.to ? pather.join(url, item.to) : url}
            primary={item.primary}
            icon={item.icon}
            handleSelect={handleSelect}
            selectedPage={selectedPage}
          />
        ))}
      </div>
      <Divider component="li" />
      <div>
        <ListSubheader inset>Yardım</ListSubheader>
        {history.location.pathname === pather.join(url, "calendar") && (
          <ListItem>
            <ListItemIcon>
              <AbsenceIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Devamsızlık" />
          </ListItem>
        )}
      </div>
    </>
  );
}
