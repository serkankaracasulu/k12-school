import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import DialogWrapper from "../../../../DialogW";
import AddForm from "./Add/Index";
import TableValues from "./TableValues";
import { EducationYear } from "../../../../../generated/graphql";

type PropsType = {
  educationYears: EducationYear[];
  close(): void;
  schoolId: string;
};

export default function EducationYearComp(props: PropsType) {
  const { close, educationYears, schoolId } = props;
  const [add, setAdd] = React.useState(false);
  return (
    <DialogWrapper setOpen={close} title="Eğitim Dönemi">
      {add ? (
        <AddForm schoolId={schoolId} />
      ) : (
        <TableValues educationYears={educationYears} schoolId={schoolId} />
      )}
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAdd((previousValue) => !previousValue)}
        >
          {add ? "GERİ" : "EĞİTİM YILI EKLE"}
        </Button>
      </DialogActions>
      <Typography variant="caption">
        * En son eklenen, geçerli eğitim yılı olarak atanacaktır, eğitim yılı
        bitmeden başka bir tane eklemeyiniz.
      </Typography>
    </DialogWrapper>
  );
}
