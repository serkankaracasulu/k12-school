import * as React from "react";

import Pagination from "@material-ui/lab/Pagination";

import { limit } from "./variable";

type PropsType = {
  length: number;
  pageState: [number, React.Dispatch<React.SetStateAction<number>>];
};
export default function StudyPagination(props: PropsType) {
  const { length, pageState } = props;
  const [page, setPage] = pageState;
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };
  return (
    <Pagination
      count={Math.ceil(length / limit)}
      page={page}
      onChange={handleChange}
    />
  );
}
