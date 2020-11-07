import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

type ItemType = {
  removeTime: () => React.ReactNode;
  addTime: () => React.ReactNode;
  setStart: () => React.ReactNode;
  breath: () => React.ReactNode;
  code: number;
  start: string;
  finish: string;
};
type PropsType = {
  times: ItemType[];
  isEdit: boolean;
};
const columns = ["Başlangıç", "Bitiş"];
export default function HoursTable(props: PropsType) {
  const { times, isEdit } = props;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          {columns.map((column) => (
            <TableCell key={column}>{column}</TableCell>
          ))}
          {isEdit && <TableCell>Ara</TableCell>}
          {isEdit && <TableCell>Sil</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {times.map((item, index) => {
          return (
            <React.Fragment key={item.code}>
              <TableRow>
                <TableCell>{item.code}</TableCell>
                <TableCell>
                  {isEdit && index === 0 ? item.setStart() : item.start}
                </TableCell>
                <TableCell>{item.finish}</TableCell>
                <TableCell>
                  {isEdit && index < times.length - 1 && item.breath()}
                </TableCell>
                {isEdit && <TableCell>{item.removeTime()} </TableCell>}
              </TableRow>
              {isEdit && times.length - 1 === index && (
                <TableRow>
                  <TableCell>{item.addTime()}</TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
