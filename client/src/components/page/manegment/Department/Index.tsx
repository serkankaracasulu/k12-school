import * as React from "react";
import MaterialTable from "material-table";
import { Container } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import validate from "../../../../helper/validate";
import SnackBar from "../../../SnackBar";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import schema from "./schema";
import { SnackBarProp } from "../../../myTypes";
import {
  DeapartmentFragment,
  DepartmentsDocument,
  DepartmentsQuery,
  DepartmentsQueryVariables,
  useDepartmentsQuery,
  useRemoveDepartmentMutation,
} from "../../../../generated/graphql";
import { useEditDepartmentMutation } from "./../../../../generated/graphql";

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
}));

export default function Index() {
  const classes = useStyles();
  const query = useDepartmentsQuery();
  const columns = [{ title: "Name", field: "name" }];
  const [createDepartment] = useEditDepartmentMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [removeDepartment] = useRemoveDepartmentMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  return (
    <Container maxWidth="lg" className={classes.container}>
      <MaterialTable
        title="Department"
        columns={columns}
        data={query.data ? query.data.departments : []}
        editable={{
          onRowAdd: (newData) => {
            return new Promise((res, rej) => {
              const validateError = validate(newData, schema);
              if (validateError) {
                generateValidateError(setSnackBarProp, validateError);
                rej();
              }
              return createDepartment({
                variables: newData,
                update: (cache, result) => {
                  const newDepartment =
                    result && result.data && result.data.editDepartment;
                  const departments = query.data ? query.data.departments : [];
                  newDepartment &&
                    cache.writeQuery<
                      DepartmentsQuery,
                      DepartmentsQueryVariables
                    >({
                      query: DepartmentsDocument,
                      data: {
                        departments: [newDepartment, ...departments],
                      },
                    });
                  res();
                },
              });
            });
          },
          onRowDelete: (oldData: DeapartmentFragment) => {
            return new Promise((res, rej) => {
              return removeDepartment({
                variables: { _id: oldData._id },
                update: (cache, result) => {
                  const removeId =
                    result.data && result.data.removeDepartment._id;
                  if (removeId && query.data) {
                    const mDepartment = query.data.departments.filter(
                      (d) => d._id !== removeId
                    );
                    mDepartment &&
                      cache.writeQuery<
                        DepartmentsQuery,
                        DepartmentsQueryVariables
                      >({
                        query: DepartmentsDocument,
                        data: { departments: mDepartment },
                      });
                    res();
                  } else rej();
                },
              });
            });
          },
        }}
      />
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </Container>
  );
}
