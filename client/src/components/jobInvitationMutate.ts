import {
  JobRequestDocument,
  JobRequestQuery,
  JobRequestQueryVariables,
  useAcceptInvitationMutation,
} from "../generated/graphql";
import { generateError, generateSuccess } from "../helper/generateMessage";
import messageBox from "./messageBox";
import { SetSnackBarProp } from "./myTypes";

export default function (setSnackBarProp: SetSnackBarProp) {
  const [acceptInvitation] = useAcceptInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [deleteInvitation] = useAcceptInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  return (invitationId: string, r?: boolean, d?: boolean) => {
    if (d)
      deleteInvitation({
        variables: { invitationId, d },
        update: (cache, result) => {
          const jobRequestsQuery = cache.readQuery<
            JobRequestQuery,
            JobRequestQueryVariables
          >({
            query: JobRequestDocument,
          });
          if (jobRequestsQuery && result.data) {
            const { jobRequests } = jobRequestsQuery;
            const returnData = result.data.acceptInvitation;
            if (returnData) {
              const otherRequest = jobRequests.filter(
                (j) => j._id !== returnData._id
              );
              cache.writeQuery<JobRequestQuery, JobRequestQueryVariables>({
                query: JobRequestDocument,
                data: { jobRequests: otherRequest },
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
