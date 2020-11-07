import * as React from "react";

import { DriverStudentApplication } from "../../../generated/graphql";
import CancelButton from "./Cancel";
import SendDriverStudentButton from "./Send";

type PropsType = {
  applicaiton?: DriverStudentApplication | null;
  studentId: string;
  driverId: string;
};
export default function DriverStudentButton({
  applicaiton,
  studentId,
  driverId,
}: PropsType) {
  return (
    <>
      {applicaiton ? (
        <>
          {applicaiton.status === 1 && (
            <CancelButton
              studentId={studentId}
              requestId={applicaiton._id}
              driverId={driverId}
            />
          )}
          {applicaiton.status === 2 && ""}
        </>
      ) : (
        <SendDriverStudentButton driverId={driverId} studentId={studentId} />
      )}
    </>
  );
}
