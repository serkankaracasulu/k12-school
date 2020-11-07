import * as React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import {
  DriversWithAppDocument,
  DriversWithAppQuery,
  DriversWithAppQueryVariables,
  useSendInvitationDriverMutation,
} from "../../../generated/graphql";

type PropsType = { studentId: string; driverId: string };

export default function SendDriverStudentButton({
  studentId,
  driverId,
}: PropsType) {
  const [mutate, { loading, data, error }] = useSendInvitationDriverMutation();
  const handleMutate = () => {
    mutate({
      variables: { parentStudentId: studentId, driverId },
      update: (proxy, result) => {
        if (!result.data) return;
        const { sendInvitationDriver } = result.data;
        const driversQuery = proxy.readQuery<
          DriversWithAppQuery,
          DriversWithAppQueryVariables
        >({
          query: DriversWithAppDocument,
          variables: { parentStudentId: studentId },
        });
        if (!driversQuery) return;
        const drivers = driversQuery.drivers.map((d) => {
          if (d._id === driverId && result.data) {
            return {
              ...d,
              driver: {
                ...d.driver!,
                requestApp: sendInvitationDriver,
              },
            };
          }
          return d;
        });
        proxy.writeQuery<DriversWithAppQuery, DriversWithAppQueryVariables>({
          query: DriversWithAppDocument,
          variables: { parentStudentId: studentId },
          data: { drivers },
        });
      },
    });
  };
  return (
    <Tooltip title="Servis sürücüsü ekle">
      <IconButton
        color="primary"
        onClick={handleMutate}
        disabled={loading || !!error || !!data}
      >
        <PersonAddIcon />
      </IconButton>
    </Tooltip>
  );
}
