import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

import {
  DriverServiceRequestsDocument,
  DriverServiceRequestsQuery,
  DriverServiceRequestsQueryVariables,
  DriverStudentApplication,
  useCancelServiceRequestDriverMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import Context from "../../../Context";
import messageBox from "./messageBoxCancel";

type PropsType = {
  request: DriverStudentApplication;
};

export default function CancelServiceRequest({ request }: PropsType) {
  const { setPr } = React.useContext(Context);
  const [cancel] = useCancelServiceRequestDriverMutation({
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
    },
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
  });
  const handleCancel = () => {
    cancel({
      variables: { requestId: request._id },
      update: (proxy, result) => {
        if (!result.data?.cancelServiceRequestDriver.success) return;
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
    <IconButton aria-label="remove application" onClick={handleCancel}>
      <CancelIcon />
    </IconButton>
  );
}
