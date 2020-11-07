import * as React from "react";

import {
  IconButton,
  InputBase,
  List,
  ListItem,
  ListSubheader,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Pagination } from "@material-ui/lab";

import {
  StudentQuery,
  useStudentCountQuery,
  useStudentsQuery,
} from "../../../../generated/graphql";
import StudentItem from "../ListStudentItem";
import DeleteStudent from "./Delete";

type PropsType = {
  classId?: string;
  schoolId?: string;
  title?: string;
  schoolIds?: string[];
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
      },
    },
    listItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      width: "265px",
      height: "80px",
      padding: theme.spacing(2),
    },
    listItemAdd: {
      padding: theme.spacing(1),
    },
    subHeader: {
      display: "flex",
      width: "100%",
    },
    avatar: {
      width: "60px",
      height: "60px",
      marginRight: theme.spacing(1),
    },
    menu: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    subheaderText: {
      flex: 1,
    },
    input: {
      marginLeft: theme.spacing(2),
    },
    iconButton: {
      padding: 10,
    },
  })
);
export default function StudentList(props: PropsType) {
  const listCount = 12;
  const [page, setPage] = React.useState(1);
  const classes = useStyles();
  const { classId, schoolId, title } = props;
  const { data, refetch } = useStudentsQuery({
    fetchPolicy: "network-only",
    variables: { schoolId, classId, page },
  });
  const { data: dataStudentCount } = useStudentCountQuery({
    variables: { schoolId, classId },
  });
  const [student, setStudent] = React.useState<StudentQuery["student"] | null>(
    null
  );
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClick = (studentItem: StudentQuery["student"]) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
    setStudent(studentItem);
  };
  const searchInput = React.useRef<HTMLInputElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handleDelete = () => {
    setOpen(true);
  };
  const handleSeach = () => {
    if (searchInput)
      refetch({ schoolId, classId, search: searchInput.current?.value });
  };
  /*
  React.useEffect(() => {
    if (conflit && !data && !error && !loading) {
      sendConflit();
    }
  }, [conflit, data, error, loading, sendConflit]);
  */

  if (data)
    return (
      <ListItem>
        <List
          className={classes.list}
          subheader={
            <ListSubheader className={classes.subHeader}>
              <span className={classes.subheaderText}>{title}</span>
              <InputBase
                className={classes.input}
                placeholder="Ara"
                inputProps={{ "aria-label": "Search" }}
                inputRef={searchInput}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
                onClick={handleSeach}
              >
                <SearchIcon />
              </IconButton>
            </ListSubheader>
          }
        >
          {data.students.map((studentItem) => (
            <StudentItem
              student={studentItem}
              handleClick={handleClick}
              key={studentItem._id}
            />
          ))}
          <ListItem>
            <Pagination
              count={Math.ceil(
                (dataStudentCount?.studentCount.studentCount || 12) / listCount
              )}
              variant="outlined"
              page={page}
              onChange={handleChange}
            />
          </ListItem>
        </List>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDelete}>Öğrenciyi sil</MenuItem>
        </Menu>
        {open && student && (
          <DeleteStudent student={student} setOpen={() => setOpen(false)} />
        )}
      </ListItem>
    );
  return <li />;
}
