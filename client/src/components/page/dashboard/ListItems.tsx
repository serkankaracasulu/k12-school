import pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { SchoolRounded as SchoolIcon } from "@material-ui/icons";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import StudentIcon from "@material-ui/icons/LocalLibraryRounded";
import PersonIcon from "@material-ui/icons/PersonRounded";

import ListItemLink from "../../ListItemLink";

export function MainListItems() {
  const { url } = useRouteMatch();
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(
    history.location.pathname
  );
  const handleSelect = (page: string) => {
    setSelectedPage(page);
  };
  return (
    <div>
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
        icon={<SchoolIcon />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "teachers")}
        primary="Öğretmenler"
        handleSelect={handleSelect}
        selectedPage={selectedPage}
        icon={<PersonIcon />}
      />
      <ListItemLink
        to={pather.join(url, "students")}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
        primary="Öğrenciler"
        icon={<StudentIcon />}
      />
      <ListItemLink
        to={pather.join(url, "drivers")}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
        primary="Sürücüler"
        icon={<DirectionsBusIcon />}
      />
    </div>
  );
}
