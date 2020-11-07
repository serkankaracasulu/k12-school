import chartjs from "chart.js";
import _ from "lodash";
import { DateTime, DurationUnit } from "luxon";
import React from "react";
import { ChartData, Line, Pie } from "react-chartjs-2";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import colors from "./COLORS.json";
import dumyData from "./MOCK_DATA.json";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1, 3),
    minWidth: 120,
  },
}));
const durations: { duration: DurationUnit; label: string }[] = [
  { duration: "quarter", label: "Çeyrek" },
  { duration: "month", label: "Aylık" },
  { duration: "week", label: "haftalık" },
  { duration: "days", label: "Günlük" },
];
export default function SchoolChart() {
  const nowYear = DateTime.local().year;
  const [years] = React.useState<number[]>(() => {
    const yearList = [];
    for (let index = 0; index < 6; index++) {
      yearList.push(nowYear - index);
    }
    return yearList;
  });
  const [timeRange, setTimeRange] = React.useState<DurationUnit>("month");
  const [year, setYear] = React.useState(nowYear);
  const [className, setClassName] = React.useState("");
  const classes = useStyles();

  const groupByCreatedAtFunc = (selectYear: number = year) => {
    const values = _.chain(
      dumyData.filter((d) => DateTime.fromISO(d.createdAt).year === selectYear)
    )
      .groupBy((s) =>
        DateTime.fromISO(s.createdAt).startOf(timeRange).toFormat("yyyy LL dd")
      )
      .map((group, date) => {
        return { date, groupCount: group.length };
      })
      .orderBy((o) => o.date)
      .value();
    const labels = values.map((v) => v.date);
    const data = values.map((v) => v.groupCount);
    const returnData: ChartData<chartjs.ChartData> = {
      labels,
      datasets: [
        {
          data,
          label: "Öğrenci sayısı",
          backgroundColor: colors.slice(0, labels.length).map((c) => c[0]),
        },
      ],
    };
    return returnData;
  };
  const handleChangeYear = (selectedYear: number) => {
    setYear(selectedYear);
  };
  const groupBySchoolNameFunc = (selectYear: number = year) => {
    const values = _.chain(
      dumyData.filter((d) => DateTime.fromISO(d.createdAt).year === selectYear)
    )
      .groupBy((s) => s.schoolName)
      .map((group, schoolName) => {
        return { schoolName, groupCount: group.length };
      })
      .value();
    const labels = values.map((v) => v.schoolName);
    const data = values.map((v) => v.groupCount);
    const returnData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length).map((c) => c[0]),
        },
      ],
    };
    return returnData;
  };

  const groupByClassNameFunc = (
    selectYear: number = year,
    schoolName: string
  ) => {
    const values = _.chain(
      dumyData.filter(
        (d) =>
          DateTime.fromISO(d.createdAt).year === selectYear &&
          d.schoolName === schoolName
      )
    )
      .groupBy((s) => s.className)
      .map((group, className) => {
        return { className, groupCount: group.length };
      })
      .value();
    const labels = values.map((v) => v.className);
    const data = values.map((v) => v.groupCount);
    const returnData: ChartData<chartjs.ChartData> = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length).map((c) => c[0]),
        },
      ],
    };
    return returnData;
  };
  const [groupByClassName, setByClassName] = React.useState<
    ChartData<chartjs.ChartData>
  >();
  const [groupByCreatedAt, setCreatedAt] = React.useState(groupByCreatedAtFunc);
  const [groupBySchoolName, setBySchoolName] = React.useState(
    groupBySchoolNameFunc
  );

  const selectClass = (e: any) => {
    if (!Array.isArray(e) || e.length === 0) return;
    const [element] = e;
    if (!element || isNaN(element._index)) return;
    const index = element._index as number;
    const label = groupBySchoolName.labels[index];
    console.log(label);
    setClassName(label);
    setByClassName(groupByClassNameFunc(year, label));
  };
  React.useEffect(() => {
    setCreatedAt(groupByCreatedAtFunc(year));
    setBySchoolName(groupBySchoolNameFunc(year));
    if (className) setByClassName(groupByClassNameFunc(year, className));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, className]);
  React.useEffect(() => {
    setCreatedAt(groupByCreatedAtFunc(year));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);
  if (groupByCreatedAt)
    return (
      <Grid container>
        <Grid container justify="center">
          <FormControl className={classes.formControl}>
            <InputLabel id="year">Yıl</InputLabel>
            <Select
              labelId="year"
              value={year}
              onChange={(e) => handleChangeYear(e.target.value as number)}
            >
              {years.map((yearItem) => (
                <MenuItem value={yearItem} key={yearItem}>
                  {yearItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container>
          <Grid item xs={12} lg={6}>
            <Typography align="center" variant="h6">
              Okula Göre Öğrenci Sayısı
            </Typography>
            <Pie
              data={groupBySchoolName}
              options={{ responsive: true }}
              onElementsClick={selectClass}
            />
          </Grid>
          {groupByClassName && (
            <Grid item xs={12} lg={6}>
              <Typography align="center" variant="h6">
                {className} Okulu Öğrenci Sayısı
              </Typography>
              <Pie data={groupByClassName} options={{ responsive: true }} />
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid item>
            <Typography align="center" variant="h6">
              Dönemlik Kayıt Olan Öğrenci Saysı
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel id="year">Süre</InputLabel>
              <Select
                labelId="duraion"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as DurationUnit)}
              >
                {durations.map((d) => (
                  <MenuItem value={d.duration} key={d.duration}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Line data={groupByCreatedAt} options={{ responsive: true }} />
        </Grid>
      </Grid>
    );

  return <span></span>;
}
