/* eslint-disable react/display-name */
import * as React from "react";
import { LinkProps, NavLink, useHistory } from "react-router-dom";

import { Badge } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import {
  BookRounded as LessonIcon,
  CalendarTodayRounded as Calendar,
} from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AbsenceIcon from "@material-ui/icons/PanTool";

import { StudyState, useStudiesQuery } from "../../../generated/graphql";
import { RouterCons } from "../../Routers";

type PropsType = {
  icon: React.ReactElement;
  primary: string;
  to: string;
  handleSelect(to: string): void;
  selectedPage: string;
};
function ListItemLink(props: PropsType) {
  const { icon, primary, to, handleSelect, selectedPage } = props;
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<LinkProps, "to">>((itemProps, ref) => (
        <NavLink to={to} {...itemProps} innerRef={ref} />
      )),
    [to]
  );

  return (
    <ListItem
      button
      component={renderLink}
      onClick={() => handleSelect(to)}
      selected={to === selectedPage}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
}

export function MainListItems() {
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(
    history.location.pathname
  );
  const handleSelect = (page: string) => {
    setSelectedPage(page);
  };
  const { data } = useStudiesQuery();
  return (
    <div>
      <ListItemLink
        to={RouterCons.teacher.base}
        primary="Göstergeler"
        icon={<DashboardIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={RouterCons.teacher.calender.fullpath}
        primary="Takvimim"
        icon={<Calendar />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={RouterCons.teacher.lessons.fullpath}
        primary="Derslerim"
        icon={<LessonIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={RouterCons.teacher.absence.fullpath}
        primary="Devamsızlık"
        icon={<AbsenceIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={RouterCons.teacher.study.fullpath}
        primary="Etüt"
        icon={
          <Badge
            badgeContent={
              data?.studies.filter((studyValue) =>
                studyValue.students.some((s) => s.state === StudyState.Unread)
              ).length
            }
            color="primary"
          >
            <BookmarkIcon />
          </Badge>
        }
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
    </div>
  );
}

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Raporlar</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
  </div>
);
