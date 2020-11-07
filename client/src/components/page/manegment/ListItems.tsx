import * as pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";

import ListItemLink from "../../ListItemLink";

export default function MainListItems() {
  const { url } = useRouteMatch();
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(
    history.location.pathname
  );
  const handleSelect = (page: string) => {
    setSelectedPage(page);
  };
  return (
    <>
      <ListItemLink
        to={url}
        primary="Göstergeler"
        icon={<DashboardIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "schools")}
        primary="Okullar"
        icon={<PeopleIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "lessons")}
        primary="Dersler"
        icon={<PeopleIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "departments")}
        primary="Fakülteler"
        icon={<PeopleIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "teacherfields")}
        primary="Öğr. Alanları"
        icon={<PeopleIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "universities")}
        primary="Üniversiteler"
        icon={<PeopleIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
    </>
  );
}
