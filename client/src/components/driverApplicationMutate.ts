import {
  DriverApplicationsDocument,
  DriverApplicationsQuery,
  DriverApplicationsQueryVariables,
  useAddDriverMutation,
  useDeleteInvitationMutation,
  useReSendInvitationMutation,
} from "../generated/graphql";
import { generateError, generateSuccess } from "../helper/generateMessage";
import messageBoxR from "./messageBox";
import messageBoxAcc from "./messageBoxAppAcc";
import messageBox from "./messageBoxAppDel";
import { SetSnackBarProp } from "./myTypes";

export default function (setSnackBarProp: SetSnackBarProp) {
  const [deleteI] = useDeleteInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [addDriverMutation] = useAddDriverMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBoxAcc),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBoxAcc),
  });
  const [reSend] = useReSendInvitationMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBoxR),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBoxR),
  });
  const handleResend = (applicationId: string) => {
    reSend({ variables: { applicationId } });
  };
  const deleteMutate = (applicationId: string) => {
    deleteI({
      variables: { applicationId },
      update: (dataProxy, mutationResult) => {
        const teacherApplicationQuery = dataProxy.readQuery<
          DriverApplicationsQuery,
          DriverApplicationsQueryVariables
        >({
          query: DriverApplicationsDocument,
        });
        const { data: dataDelete } = mutationResult;
        if (dataDelete && teacherApplicationQuery) {
          const { driverApplications } = teacherApplicationQuery;
          const otherApplications = driverApplications.filter(
            (ta) => ta._id !== dataDelete.deleteInvitation._id
          );
          dataProxy.writeQuery<
            DriverApplicationsQuery,
            DriverApplicationsQueryVariables
          >({
            query: DriverApplicationsDocument,
            data: { driverApplications: otherApplications },
          });
        }
      },
    });
  };
  const addMutate = (applicationId: string) => {
    addDriverMutation({
      variables: { applicationId },
      update: (cache, result) => {
        const applications = cache.readQuery<
          DriverApplicationsQuery,
          DriverApplicationsQueryVariables
        >({
          query: DriverApplicationsDocument,
        });
        if (result.data && applications) {
          const { driverApplications } = applications;
          const otherApplications = driverApplications.filter(
            (ta) => ta._id !== applicationId
          );
          cache.writeQuery<
            DriverApplicationsQuery,
            DriverApplicationsQueryVariables
          >({
            query: DriverApplicationsDocument,
            data: { driverApplications: otherApplications },
          });
        }
      },
    });
  };
  return [deleteMutate, addMutate, handleResend];
}
