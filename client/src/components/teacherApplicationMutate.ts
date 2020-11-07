import {
  TeacherApplicationsDocument,
  TeacherApplicationsQuery,
  TeacherApplicationsQueryVariables,
  useAddTeacherMutation,
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
  const [addTeacherMutation] = useAddTeacherMutation({
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
          TeacherApplicationsQuery,
          TeacherApplicationsQueryVariables
        >({
          query: TeacherApplicationsDocument,
        });
        const { data: dataDelete } = mutationResult;
        if (dataDelete && teacherApplicationQuery) {
          const { teacherApplications } = teacherApplicationQuery;
          const otherApplications = teacherApplications.filter(
            (ta) => ta._id !== dataDelete.deleteInvitation._id
          );
          dataProxy.writeQuery<
            TeacherApplicationsQuery,
            TeacherApplicationsQueryVariables
          >({
            query: TeacherApplicationsDocument,
            data: { teacherApplications: otherApplications },
          });
        }
      },
    });
  };
  const addMutate = (applicationId: string) => {
    addTeacherMutation({
      variables: { applicationId },
      update: (cache, result) => {
        const teacherApplicationQuery = cache.readQuery<
          TeacherApplicationsQuery,
          TeacherApplicationsQueryVariables
        >({
          query: TeacherApplicationsDocument,
        });
        if (result.data && teacherApplicationQuery) {
          const { teacherApplications } = teacherApplicationQuery;
          const otherApplications = teacherApplications.filter(
            (ta) => ta._id !== applicationId
          );
          cache.writeQuery<
            TeacherApplicationsQuery,
            TeacherApplicationsQueryVariables
          >({
            query: TeacherApplicationsDocument,
            data: { teacherApplications: otherApplications },
          });
        }
      },
    });
  };
  return [deleteMutate, addMutate, handleResend];
}
