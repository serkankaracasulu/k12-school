import {
  DriverJobRequestsDocument,
  DriverJobRequestsQuery,
  DriverJobRequestsQueryVariables,
  useAcceptDriverInvitationMutation,
} from "../generated/graphql";
import { generateError, generateSuccess } from "../helper/generateMessage";
import messageBox from "./messageBox";
import { SetSnackBarProp } from "./myTypes";

export default function (setSnackBarProp: SetSnackBarProp) {
  const [acceptInvitation] = useAcceptDriverInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [deleteInvitation] = useAcceptDriverInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  return (invitationId: string, r?: boolean, d?: boolean) => {
    if (d)
      deleteInvitation({
        variables: { invitationId, d },
        update: (cache, result) => {
          const jobRequestsQuery = cache.readQuery<
            DriverJobRequestsQuery,
            DriverJobRequestsQueryVariables
          >({
            query: DriverJobRequestsDocument,
          });
          if (jobRequestsQuery && result.data) {
            const { driverJobRequests } = jobRequestsQuery;
            const returnData = result.data.acceptDriverInvitation;
            if (returnData) {
              const otherRequest = driverJobRequests.filter(
                (j) => j._id !== returnData._id
              );
              cache.writeQuery<
                DriverJobRequestsQuery,
                DriverJobRequestsQueryVariables
              >({
                query: DriverJobRequestsDocument,
                data: { driverJobRequests: otherRequest },
              });
            }
          }
        },
      });
    else
      acceptInvitation({
        variables: r ? { invitationId, r } : { invitationId },
      });
  };
}
