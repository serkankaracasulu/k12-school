import * as React from "react";
import StudyCardItem from "./StudyItem";
import PaginationStudy from "./Pagination";
import { limit } from "./variable";
import { useStudiesQuery } from "./../../generated/graphql";

export default function StudyMain() {
  const { data } = useStudiesQuery();
  const pageState = React.useState(1);
  const startPage = (pageState[0] - 1) * limit;
  return (
    <>
      {data &&
        data.studies
          .slice(startPage, startPage + limit)
          .map((studyValue) => (
            <StudyCardItem
              study={studyValue}
              key={studyValue._id}
              skip={data.studies.length}
              queryVariables={{}}
            />
          ))}
      {data && (
        <PaginationStudy length={data.studies.length} pageState={pageState} />
      )}
    </>
  );
}
