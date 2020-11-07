import * as pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { ContactPhone, SchoolSharp } from "@material-ui/icons/";
import DashboardIcon from "@material-ui/icons/Dashboard";

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
        to={pather.join(url, "contact")}
        primary="İletişim"
        icon={<ContactPhone />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
      <ListItemLink
        to={pather.join(url, "education")}
        primary="Eğitim"
        icon={<SchoolSharp />}
        handleSelect={handleSelect}
        selectedPage={selectedPage}
      />
    </div>
  );
}
