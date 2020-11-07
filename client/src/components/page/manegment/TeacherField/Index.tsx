import MaterialTable from "material-table";
import * as React from "react";

import { Chip, Container } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  TeacherFieldsDocument,
  TeacherFieldsQuery,
  TeacherFieldsQueryVariables,
  useEditTeacherFieldMutation,
  useRemoveDepartmentsToTeacherFieldMutation,
  useRemoveTeacherFieldMutation,
  useTeacherFieldsQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
import AddDepartment from "./AddDepartment";
import schema from "./schema";

const messageBox = {
  success: { message: "Kayıt edildi.", variant: "success" },
  code100: {
    messageeOkulCode: "Bu E-Okul koduna sahip başka okul var",
    messagename: "Bu isme sahip başka okul var",
    variant: "info",
  },
  code102: {
    message: "Kayıt edilecek okul bulunamadı",
    messageHour: "Dönem bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
};
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    position: "relative",
  },
  chips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function TeacherFieldPage() {
  const classes = useStyles();
  const query = useTeacherFieldsQuery();
  const columns = [{ title: "Name", field: "name" }];
  const teacherFields = query.data ? query.data.teacherFields : [];
  const [createTeacherField] = useEditTeacherFieldMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [removeTeacherField] = useRemoveTeacherFieldMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [removeDepartment] = useRemoveDepartmentsToTeacherFieldMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [variables, setVariables] = React.useState("");
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const handleAddDepartments = (
    field: TeacherFieldsQuery["teacherFields"][0]
  ) => {
    setVariables(field._id);
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      <MaterialTable
        title="Teacher Field"
        columns={columns}
        data={teacherFields}
        detailPanel={(rowData) => {
          return (
            <div className={classes.chips}>
              {rowData.departments.map((de) => (
                <Chip
                  key={de._id}
                  label={de.name}
                  onDelete={() => {
                    removeDepartment({
                      variables: { id: de._id, _id: rowData._id },
                    });
                  }}
                />
              ))}
            </div>
          );
        }}
        editable={{
          onRowAdd: (newData) => {
            return new Promise((res, rej) => {
              const validateError = validate(newData, schema);
              if (validateError) {
                generateValidateError(setSnackBarProp, validateError);
                rej();
              }
              return createTeacherField({
                variables: newData,
                update: (cache, result) => {
                  const newTeacherField =
                    result.data && result.data.editTeacherField;
                  newTeacherField &&
                    cache.writeQuery<
                      TeacherFieldsQuery,
                      TeacherFieldsQueryVariables
                    >({
                      query: TeacherFieldsDocument,
                      data: {
                        teacherFields: [newTeacherField, ...teacherFields],
                      },
                    });
                  res();
                },
              });
            });
          },
          onRowDelete: (oldData) => {
            return new Promise((res, rej) => {
              return removeTeacherField({
                variables: { _id: oldData._id },
                update: (cache, result) => {
                  const removeId =
                    result.data && result.data.removeTeacherField._id;
                  if (removeId && query.data) {
                    const mTeacherFields = query.data.teacherFields.filter(
                      (d) => d._id !== removeId
                    );
                    mTeacherFields &&
                      cache.writeQuery<
                        TeacherFieldsQuery,
                        TeacherFieldsQueryVariables
                      >({
                        query: TeacherFieldsDocument,
                        data: { teacherFields: mTeacherFields },
                      });
                    res();
                  }
                },
              });
            });
          },
        }}
        actions={[
          {
            icon: "add",
            tooltip: "Add Departments",
            onClick: (event, rowData) => {
              if (!Array.isArray(rowData)) handleAddDepartments(rowData);
            },
          },
        ]}
      />
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
      {variables && (
        <AddDepartment
          id={variables}
          close={() => setVariables("")}
          setSnackBarProp={setSnackBarProp}
        />
      )}
    </Container>
  );
}
