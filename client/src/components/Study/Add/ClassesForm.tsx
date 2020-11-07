import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import { lightBlue } from "@material-ui/core/colors";
import {
  useSchoolsQuery,
  ClassTypeFragment,
  CreateStudyMutationVariables,
} from "../../../generated/graphql";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  LinearProgress,
  Checkbox,
  Collapse,
  Button,
} from "@material-ui/core";

type PropsType = {
  setVariables(values: string[]): void;
  variables: CreateStudyMutationVariables;
};

const StudyButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(lightBlue[500]),
    backgroundColor: lightBlue[500],
    "&:hover": {
      backgroundColor: lightBlue[700],
    },
    textTransform: "capitalize",
    boxShadow: "none",
  },
}))(Button);

export default function SchoolClassAutoComplate(props: PropsType) {
  const { setVariables, variables } = props;
  const [show, setShow] = React.useState("");
  const [allowedClasses, setAllowedClasses] = React.useState<
    Set<ClassTypeFragment>
  >(new Set<ClassTypeFragment>());
  const { data, loading } = useSchoolsQuery({
    fetchPolicy: "no-cache",
    onCompleted: (tData) => {
      if (variables.permissionClasses) {
        const newSet = new Set<ClassTypeFragment>();
        for (const school of tData.schools) {
          for (const classItem of school.classes) {
            if (variables.permissionClasses.includes(classItem._id)) {
              newSet.add(classItem);
            }
          }
        }
        setAllowedClasses(newSet);
      }
    },
  });
  const handleClassCheck = (classItem: ClassTypeFragment) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.currentTarget.checked;
    const newSet = new Set(allowedClasses);
    checked ? newSet.add(classItem) : newSet.delete(classItem);
    const classIds = [...newSet].map((c) => c._id);
    setVariables(classIds);
    setAllowedClasses(newSet);
  };
  const handleAllCheck = (classItems: ClassTypeFragment[]) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.currentTarget.checked;
    const newSet = new Set(allowedClasses);
    for (const classId of classItems) {
      checked ? newSet.add(classId) : newSet.delete(classId);
    }
    setAllowedClasses(newSet);
    setVariables([...newSet].map((c) => c._id));
  };

  return (
    <>
      <FormControl component="fieldset">
        {data &&
          data.schools.map((schoolValue) => (
            <React.Fragment key={schoolValue._id}>
              <StudyButton
                onClick={() =>
                  setShow(show === schoolValue._id ? "" : schoolValue._id)
                }
              >
                {schoolValue.name}&nbsp;
                {"("}
                {
                  schoolValue.classes.filter((c) => allowedClasses.has(c))
                    .length
                }
                {")"}
              </StudyButton>
              <Collapse in={show === schoolValue._id}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={schoolValue.classes.every((c) =>
                          allowedClasses.has(c)
                        )}
                        onChange={handleAllCheck(schoolValue.classes)}
                        value="gilad"
                        size="small"
                      />
                    }
                    label="Tümü"
                  />
                  {schoolValue.classes.map((classValue) => (
                    <FormControlLabel
                      key={classValue._id}
                      control={
                        <Checkbox
                          checked={allowedClasses.has(classValue)}
                          onChange={handleClassCheck(classValue)}
                          value="gilad"
                          size="small"
                        />
                      }
                      label={
                        <span>
                          {classValue.level} {classValue.code}{" "}
                          {classValue.code1} {classValue.name}
                        </span>
                      }
                    />
                  ))}
                </FormGroup>
              </Collapse>
            </React.Fragment>
          ))}
      </FormControl>
      {loading && <LinearProgress />}
    </>
  );
}
