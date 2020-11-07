import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

import {
  DriversDocument,
  DriversWithAppDocument,
  DriversWithAppQuery,
  DriversWithAppQueryVariables,
  useCancelServiceRequestUserMutation,
} from "../../../generated/graphql";

type PropsType = { studentId: string; requestId: string; driverId: string };

export default function CancelDriverStudentButton({
  studentId,
  requestId,
  driverId,
}: PropsType) {
  const [
    mutate,
    { loading, data, error },
  ] = useCancelServiceRequestUserMutation();
  const handleMutate = () => {
    mutate({
      variables: { parentStudentId: studentId, requestId },
      update: (proxy, result) => {
        if (!result.data || !result.data.cancelServiceRequestUser.success)
          return;
        const driversQuery = proxy.readQuery<
          DriversWithAppQuery,
          DriversWithAppQueryVariables
        >({
          query: DriversWithAppDocument,
          variables: { parentStudentId: studentId },
        });
        if (!driversQuery) return;
        const drivers = driversQuery.drivers.map((d) => {
          if (d._id === driverId) {
            return {
              ...d,
              driver: {
                _id: "",
                institutions: [],
                ...d.driver,
                requestApp: undefined,
              },
            };
          }
          return d;
        });
        proxy.writeQuery<DriversWithAppQuery, DriversWithAppQueryVariables>({
          query: DriversDocument,
          data: { drivers },
          variables: { parentStudentId: studentId },
        });
      },
    });
  };
  return (
    <Tooltip title="İsteği iptal et">
      <IconButton
        color="primary"
        onClick={handleMutate}
        disabled={loading || !!error || !!data}
      >
        <CancelIcon />
      </IconButton>
    </Tooltip>
  );
}
