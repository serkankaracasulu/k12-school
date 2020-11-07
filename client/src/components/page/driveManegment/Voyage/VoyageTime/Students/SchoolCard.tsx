import clsx from "clsx";
import { useGeocode } from "google-map-hooks";
import * as React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Typography,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { VoyageFragment } from "../../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);
type PropTypes = {
  school: VoyageFragment["school"];
};
export default function SchoolVoyageInfoCardItem({ school }: PropTypes) {
  const classes = useStyles();
  const { data, loading } = useGeocode(
    {
      lat: school?.address?.coordinates[0] || 0,
      lng: school?.address?.coordinates[1] || 0,
    },
    "AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg"
  );
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (school)
    return (
      <Card className={classes.root}>
        <CardHeader title={school.name} />
        <CardContent>
          {loading && <CircularProgress />}
          <Typography variant="body2" color="secondary" component="p">
            {data && data.results[0]?.formatted_address}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            aria-expanded={expanded}
            endIcon={<ExpandMoreIcon />}
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
          >
            {!expanded && "Haritada Gör"}
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {school.address && (
              <iframe
                title="Student address"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg&q=${school.address.coordinates[0]},${school.address.coordinates[1]}&zoom=16`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: "0" }}
                allowFullScreen={false}
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            )}
          </CardContent>
        </Collapse>
      </Card>
    );
  return <span />;
}
