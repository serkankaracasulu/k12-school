import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import {
  DriverServiceRequestsDocument,
  DriverServiceRequestsQuery,
  DriverServiceRequestsQueryVariables,
  DriverStudentApplication,
  useAcceptDriverServiceInvitationMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import Context from "../../../Context";
import messageBox from "./messageBox";

type PropsType = {
  request: DriverStudentApplication;
};
export default function DriverServiceAcceptButton({ request }: PropsType) {
  const { setPr } = React.useContext(Context);
  const [accept] = useAcceptDriverServiceInvitationMutation({
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
    },
    onCompleted: (tData) => {
      generateSuccess(setPr, messageBox);
    },
  });

  const handleAccept = () => {
    accept({
      variables: { invitationId: request._id },
      update: (proxy, result) => {
        if (!result.data) return;
        try {
          const requestQuery = proxy.readQuery<
            DriverServiceRequestsQuery,
            DriverServiceRequestsQueryVariables
          >({
            query: DriverServiceRequestsDocument,
          });
          if (!requestQuery) return;
          const requests = requestQuery.driverServiceRequests.filter(
            (d) => d._id !== request._id
          );
          proxy.writeQuery<
            DriverServiceRequestsQuery,
            DriverServiceRequestsQueryVariables
          >({
            query: DriverServiceRequestsDocument,
            data: { driverServiceRequests: requests },
          });
        } catch (error) {
          //
        }
      },
    });
  };
  return (
    <IconButton aria-label="add student" onClick={handleAccept}>
      <PersonAddIcon />
    </IconButton>
  );
}
