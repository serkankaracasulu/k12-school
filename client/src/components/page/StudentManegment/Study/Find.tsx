import enLocale from "date-fns/locale/en-US";
import trLocale from "date-fns/locale/tr";
import * as React from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import {
  StudyQuery,
  useLessonsGQuery,
  useStudiesLazyQuery,
} from "../../../../generated/graphql";
import PaginationStudy from "../../../Study/Pagination";
import StudyCardItem from "../../../Study/StudyItem";
import { limit } from "../../../Study/variable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      padding: theme.spacing(0, 1),
      maxWidth: 600,
    },
    margin: {
      marginRight: theme.spacing(1),
    },
    dateField: {
      border: "1px solid rgba(224, 224, 224, 1)",
      display: "block",
      padding: theme.spacing(1),
    },
    lesson: {
      width: "200px",
    },
    button: {
      float: "right",
      marginTop: theme.spacing(1),
    },
  })
);
export default function FindStudy() {
  const classes = useStyles();
  const [variables, setVariables] = React.useState<StudyQuery>({});
  const pageState = React.useState(1);
  const startPage = (pageState[0] - 1) * limit;
  const [isDateEnable, setIsDateEnable] = React.useState(false);
  const [searchStudy, { data: dataStudy }] = useStudiesLazyQuery({
    fetchPolicy: "cache-and-network",
    onError: () => {},
  });
  const { data, loading } = useLessonsGQuery({
    onError: () => {},
  });

  const handleDateChange = (name: keyof Omit<StudyQuery, "lessonId">) => (
    date: Date | null
  ) => {
    date && setVariables({ ...variables, [name]: date.toISOString() });
  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchStudy({ variables: { query: variables } });
  };
  const handleDateEnable = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setIsDateEnable(checked);
    if (isDateEnable)
      setVariables({ ...variables, date: undefined, endDate: undefined });
  };
  return (
    <>
      <form className={classes.form} onSubmit={handleSearch}>
        <Autocomplete
          options={data?.lessonsG || []}
          getOptionLabel={(option) => option.name}
          loading={loading}
          multiple={false}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Ders"
              className={classes.lesson}
            />
          )}
          onChange={(e: any, lessonValue) =>
            setVariables({
              ...variables,
              lessonId: lessonValue ? lessonValue._id : undefined,
            })
          }
        />
        <FormControl component="fieldset" className={classes.dateField}>
          <FormLabel component="legend">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDateEnable}
                  onChange={handleDateEnable}
                  color="primary"
                />
              }
              label="Tarih aralığı"
            />
          </FormLabel>

          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={
              navigator.language === "tr-TR" || navigator.language === "tr"
                ? trLocale
                : enLocale
            }
          >
            <KeyboardDatePicker
              disableToolbar
              className={classes.margin}
              variant="inline"
              disabled={!isDateEnable}
              format="MM/dd/yyyy"
              value={variables.date}
              onChange={handleDateChange("date")}
              label="Başlangıç"
              KeyboardButtonProps={{
                "aria-label": "start date",
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              className={classes.margin}
              variant="inline"
              format="MM/dd/yyyy"
              disabled={!isDateEnable}
              value={variables.endDate}
              onChange={handleDateChange("endDate")}
              label="Bitiş"
              KeyboardButtonProps={{
                "aria-label": "end date",
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
          ARA
        </Button>
      </form>
      <div style={{ clear: "both" }}>
        {dataStudy &&
          dataStudy.studies
            .slice(startPage, startPage + limit)
            .map((studyValue) => (
              <StudyCardItem
                study={studyValue}
                key={studyValue._id}
                queryVariables={{ query: variables }}
                skip={dataStudy.studies.length}
              />
            ))}
        {dataStudy && (
          <PaginationStudy
            length={dataStudy.studies.length}
            pageState={pageState}
          />
        )}
      </div>
    </>
  );
}
