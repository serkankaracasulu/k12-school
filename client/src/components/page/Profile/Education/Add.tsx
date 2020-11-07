import * as React from "react";

import { Box, Button, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import {
  EditEducationMutationVariables,
  UniversityFragment,
  useDepartmentsQuery,
  useEditEducationMutation,
  useUniversitiesQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import Context from "../../../Context";
import DialogWrapper from "../../../DialogW";
import schema from "./schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(3, 0, 2, 1),
    },
    bottomMargin: {
      marginBottom: theme.spacing(1),
    },
    selectRoot: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    option: {
      zIndex: theme.zIndex.modal + 1,
    },
    marginRight: {
      marginRight: theme.spacing(1),
    },
  })
);

type PropsType = {
  setOpen(): void;
};

const messageBox = {
  code102: {
    messageSchool: "Okul bulunmadı",
    messageClass: "Sınıf bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  success: { message: "Kayıt edildi.", variant: "success" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
  UNAUTHENTICATED: { message: "Yetkisiz işlem", variant: "error" },
};
const educationLanguages = [
  { _id: 0, name: "Türkçe" },
  { _id: 1, name: "İngilizce" },
  { _id: 2, name: "Fransızca" },
  { _id: 3, name: "Almanca" },
];
const educationLevel = [
  { _id: 0, name: "Önlisans" },
  { _id: 1, name: "Lisans" },
  { _id: 2, name: "Yüksek Lisans" },
  { _id: 3, name: "Doktora" },
];
const educationType = [
  { _id: 0, name: "Normal Öğretim" },
  { _id: 1, name: "İkinci Öğretim" },
];
export default function Add(props: PropsType) {
  const { setOpen } = props;
  const [variables, setVariables] = React.useState<
    EditEducationMutationVariables
  >({
    educationLevel: 0,
    educationLevelName: educationLevel[0].name,
    departmentId: "",
    universityId: "",
    universityName: "",
    educationType: educationType[0]._id,
    educationTypeName: educationType[0].name,
    educationlanguage: educationLanguages[0]._id,
    educationlanguageName: educationLanguages[0].name,
    startDate: new Date(Date.now()).toISOString(),
  });
  const { setPr } = React.useContext(Context);
  const { data: dataU, loading: loadingUniversity } = useUniversitiesQuery();
  const { data: dataD, loading: loadingDepartment } = useDepartmentsQuery();
  const [editEducation, { loading: editLoading }] = useEditEducationMutation({
    onCompleted: () => generateSuccess(setPr, messageBox),
    onError: (cError) => generateError(cError, setPr, messageBox),
  });

  const handleEdit = () => {
    const validateError = validate(variables, schema);
    if (validateError) {
      generateValidateError(setPr, validateError);
      return;
    }
    variables && editEducation({ variables });
  };
  const filterOptions = createFilterOptions({
    stringify: (option: UniversityFragment) => option.name.toLocaleLowerCase(),
  });

  const classes = useStyles();
  return (
    <DialogWrapper title="Eğitim" setOpen={setOpen}>
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={dataU?.universities || []}
        onChange={(e, newValue) => {
          setVariables({
            ...variables,
            universityId: newValue ? newValue._id : "",
            universityName: newValue ? newValue.name : "",
          });
        }}
        className={classes.bottomMargin}
        multiple={false}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Üniversite"
            fullWidth
          />
        )}
        loading={loadingUniversity}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={dataD ? dataD.departments : []}
        onChange={(e, newValue) => {
          newValue &&
            setVariables({
              ...variables,
              departmentId: newValue._id,
            });
        }}
        className={classes.bottomMargin}
        loading={loadingDepartment}
        multiple={false}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Bölüm" fullWidth />
        )}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={educationLanguages}
        onChange={(e, newValue) => {
          newValue &&
            setVariables({
              ...variables,
              educationlanguage: newValue._id,
              educationlanguageName: newValue.name,
            });
        }}
        className={classes.bottomMargin}
        multiple={false}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Eğitim Dili"
            fullWidth
          />
        )}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={educationType}
        className={classes.bottomMargin}
        multiple={false}
        onChange={(e, newValue) => {
          newValue &&
            setVariables({
              ...variables,
              educationType: newValue._id,
              educationTypeName: newValue.name,
            });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Eğitim Tipi"
            fullWidth
          />
        )}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={educationLevel}
        className={classes.bottomMargin}
        onChange={(e: any, newValue: any) =>
          newValue &&
          setVariables({
            ...variables,
            educationLevel: newValue._id,
            educationLevelName: newValue.name,
          })
        }
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Derece" fullWidth />
        )}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <TextField
        label="Başlangıç Tarihi"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) =>
          setVariables({ ...variables, startDate: e.target.value })
        }
        value={variables.startDate}
      />
      <TextField
        label="Bitiş Tarihi"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={variables.finishDate}
        onChange={(e) =>
          setVariables({ ...variables, finishDate: e.target.value })
        }
      />
      <Box display="flex" justifyContent="flex-end">
        <Button className={classes.button} onClick={setOpen}>
          İptal
        </Button>
        <div>
          <Button
            onClick={handleEdit}
            variant="contained"
            color="primary"
            disabled={editLoading}
            className={classes.button}
          >
            Kaydet
          </Button>
        </div>
      </Box>
    </DialogWrapper>
  );
}
