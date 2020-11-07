import * as React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Close, Details, Edit } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";

import {
  CreateHourInput,
  Hour,
  useCreateHoursMutation,
  useSchoolQuery,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import { SnackBarProp } from "../../../../myTypes";
import SnackBar from "../../../../SnackBar";
import HoursForm from "./Hours";
import schema from "./schema";
import Steps from "./Steps";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      margin: theme.spacing(1),
    },
    dialogContentText: {
      padding: theme.spacing(0, 1, 5, 1),
    },
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
    button: {
      marginTop: theme.spacing(1),
    },
    icon: {
      marginLeft: theme.spacing(1),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);
const messageBox = {
  code100: {
    messageHour: "Bu saat adında başka kayıt var",
    messageDefault: "Varsayılan türde başka kayıt var",
    variant: "info",
  },
  code102: {
    messageSchool: "Okul bulunmadı",
    messageHour: "Saat bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  success: { message: "Kayıt edildi.", variant: "success" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
};

const columns = ["İsim", "Saatler"];
type PropsType = {
  setOpen(): void;
  schoolId: string;
};
export default function Index(props: PropsType) {
  const { setOpen, schoolId } = props;
  const { data } = useSchoolQuery({
    variables: { id: schoolId },
  });
  const classes = useStyles();
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const [openStep, setOpenStep] = React.useState<boolean>(false);
  const [openHour, setOpenHour] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [variables, setVariables] = React.useState<CreateHourInput | null>(
    null
  );
  const theme = useTheme<Theme>();
  function getHours(hours: Hour[]) {
    const hourArray: Hour[] = [];
    hours.forEach((hourItem) => {
      const { __typename, ...other } = hourItem;
      hourArray.push(other);
    });
    return hourArray;
  }

  const [updateHour] = useCreateHoursMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const handleUpdate = () => {
    if (variables) {
      const error = validate(variables, schema);
      if (error) {
        generateValidateError(setSnackBarProp, error);
        return;
      }
      updateHour({
        variables,
      });
      setIsEdit(false);
    }
  };
  const handleOpenHour = () => {
    if (data && data.school.weeklyHour) {
      const { __typename, hour, ...rest } = data.school.weeklyHour;
      const hourData = getHours(hour);
      setVariables({ ...rest, hour: hourData, schoolId });
      setOpenHour(true);
    }
  };
  const handleCancel = () => {
    setIsEdit(false);
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Dialog open maxWidth="md" onClose={setOpen} fullScreen={fullScreen}>
        <DialogTitle>
          Saat
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={setOpen}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!openStep ? (
            openHour ? (
              <>
                {variables && (
                  <HoursForm
                    variables={variables}
                    setVariables={setVariables}
                    isEdit={isEdit}
                  />
                )}
                <Box display="flex" justifyContent="space-between" p={1}>
                  {isEdit ? (
                    <>
                      <div>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleUpdate}
                        >
                          KAYDET
                        </Button>
                        <Button onClick={handleCancel}>İPTAL</Button>
                      </div>
                    </>
                  ) : (
                    <IconButton onClick={() => setIsEdit(true)}>
                      <Edit />
                    </IconButton>
                  )}
                  <Button onClick={() => setOpenHour(false)}>GERİ</Button>
                </Box>
              </>
            ) : (
              <>
                {data && data.school.weeklyHour && (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {columns.map((item) => {
                          return <TableCell key={item}>{item}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data && data.school.weeklyHour && (
                        <TableRow key={data.school.weeklyHour._id}>
                          <TableCell>{data.school.weeklyHour.name}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={handleOpenHour}
                              color="secondary"
                              size="small"
                            >
                              <Details />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
                {data && !data.school.weeklyHour && (
                  <Typography>Saat bilgisi yok</Typography>
                )}
                <DialogActions>
                  {data && !data.school.weeklyHour ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={() => setOpenStep(true)}
                      aria-label="add hour"
                    >
                      Saat ekle
                    </Button>
                  ) : (
                    <IconButton
                      className={classes.button}
                      onClick={() => setOpenStep(true)}
                      aria-label="add hour"
                    >
                      <Edit />
                    </IconButton>
                  )}
                </DialogActions>
              </>
            )
          ) : (
            <Steps
              schoolId={schoolId}
              setSnackBarProp={setSnackBarProp}
              setOpen={() => setOpenStep(false)}
              values={data?.school.weeklyHour}
            />
          )}
        </DialogContent>
      </Dialog>
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </>
  );
}
