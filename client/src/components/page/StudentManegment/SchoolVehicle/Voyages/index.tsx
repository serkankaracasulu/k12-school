import * as React from "react";

import { useStudentVoyagesQuery } from "../../../../../generated/graphql";
import Context from "../../../../Context";
import VoyageCardItem from "../../../driveManegment/Voyage/VoyageItem/Index";

interface IStudentVoyagesPageProps {}

const StudentVoyagesPage: React.FunctionComponent<IStudentVoyagesPageProps> = (
  props
) => {
  const { studentIndex } = React.useContext(Context);
  const { data } = useStudentVoyagesQuery({
    variables: { parentStudentId: studentIndex || "" },
  });
  return (
    <>
      {data &&
        data.studentVoyages.map((voyage) => (
          <VoyageCardItem voyage={voyage} key={voyage._id} />
        ))}
    </>
  );
};

export default StudentVoyagesPage;
