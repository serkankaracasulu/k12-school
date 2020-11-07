import * as pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Divider } from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import ListItemLink from "../../ListItemLink";

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
    to: "request",
    primary: "Servis istekleri",
    icon: <PersonAddIcon />,
  },
  {
    to: "voyage",
    primary: "Seferlerim",
    icon: <DirectionsBusIcon />,
  },
];
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
    <>
      <div>
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
      </div>
    </>
  );
}
