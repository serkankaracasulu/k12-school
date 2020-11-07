import * as React from "react";

import { CardHeader, IconButton, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Done, SchoolRounded as SchoolIcon } from "@material-ui/icons";

import {
  CreateSchoolMutationVariables,
  SchoolFragment,
  SchoolGFragment,
  useCreateSchoolMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import Context from "../../../Context";
import messageBox from "./messageBox";
import SchoolKindSelect from "./SchoolKindSelect";
import schema from "./schoolSchema";

type PropsType = {
  school: SchoolFragment;
  onClose(): void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      color: theme.palette.grey[600],
    },
  })
);

export default function EditSchool({ school }: PropsType) {
  const classes = useStyles();
  const { setPr } = React.useContext(Context);
  const [schoolValue, setSchoolValue] = React.useState<
    CreateSchoolMutationVariables
  >({
    name: school.name,
    eOkulCode: school.eOkulCode || undefined,
    schoolKindId: school.schoolKindId || undefined,
    _id: school._id,
  });
  const [updateSchool] = useCreateSchoolMutation({
    onCompleted: () => generateSuccess(setPr, messageBox),
    onError: (tError) => generateError(tError, setPr, messageBox),
  });
  const handleChangeKind = (value: SchoolGFragment | null | undefined) => {
    setSchoolValue({
      ...schoolValue,
      schoolKindId: value?._id,
    });
  };
  const handleChange = (name: keyof SchoolFragment) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSchoolValue({ ...schoolValue, [name]: event.currentTarget.value });
  };
  const handleUpdate = () => {
    const validErrors = validate(schoolValue, schema);

    if (validErrors) {
      generateValidateError(setPr, validErrors);
      return;
    }
    updateSchool({
      variables: schoolValue,
    });
    // handleCancel();
  };
  return (
    <CardHeader
      action={
        <IconButton
          onClick={handleUpdate}
          color="primary"
          aria-label="edit done"
        >
          <Done />
        </IconButton>
      }
      avatar={<SchoolIcon aria-label="recipe" className={classes.avatar} />}
      title={
        <TextField
          value={schoolValue.name}
          placeholder="Okul adı"
          onChange={handleChange("name")}
        />
      }
      subheader={
        <SchoolKindSelect
          onChangeSchoolG={handleChangeKind}
          value={schoolValue.schoolKindId}
        />
      }
    />
  );
}
