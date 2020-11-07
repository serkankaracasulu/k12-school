/* eslint-disable react/display-name */
import MaterialTable, { EditComponentProps } from "material-table";
import * as pather from "path";
import * as React from "react";

import { Avatar, Container } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Image as ImageIcon } from "@material-ui/icons";

import {
  UniversitiesQuery,
  useEditUniversityMutation,
  useUniversitiesQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
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
  avatar: {
    borderRadius: "4px",
  },
}));

export default function Index() {
  const classes = useStyles();
  const fileInput = React.useRef<HTMLInputElement | null>(null);
  const { data } = useUniversitiesQuery();
  const [editUniversity] = useEditUniversityMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const handleFile = (
    props: EditComponentProps<UniversitiesQuery["universities"][0]>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget && e.currentTarget.files) {
      const [fileData] = e.currentTarget.files;
      e.currentTarget.validity &&
        e.currentTarget.validity.valid &&
        props.onChange(fileData);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      {data && (
        <MaterialTable
          title="University"
          columns={[
            {
              title: "Logo",
              field: "universityLogoFile",
              editComponent: (props) => (
                <input
                  type="file"
                  id="logo"
                  onChange={handleFile(props)}
                  ref={fileInput}
                />
              ),
              render: (rowData) =>
                rowData.universityLogoUrl ? (
                  <Avatar
                    src={
                      rowData.universityLogoUrl
                        ? pather.join(
                            "/static",
                            "images",
                            "universitiesLogo",
                            rowData.universityLogoUrl
                          )
                        : ""
                    }
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar variant="rounded">
                    <ImageIcon />
                  </Avatar>
                ),
            },
            { title: "Name", field: "name" },
          ]}
          data={data.universities}
          editable={{
            onRowAdd: (newData) => {
              return new Promise((res, rej) => {
                return editUniversity({
                  variables: newData,
                  update: () => res(),
                });
              });
            },
            onRowUpdate: (newData, oldData) => {
              return new Promise((res, rej) => {
                const { __typename, universityLogoUrl, ...restData } = newData;
                const validateError = validate({ name: restData.name }, schema);
                if (validateError) {
                  generateValidateError(setSnackBarProp, validateError);
                  rej(validateError);
                }
                return editUniversity({
                  variables: restData,
                  update: () => res(),
                });
              });
            },
          }}
        />
      )}
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </Container>
  );
}
