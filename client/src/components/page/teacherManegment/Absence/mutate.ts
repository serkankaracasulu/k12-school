import {
  AbsenceFragment,
  AbsencesDocument,
  AbsencesQuery,
  AbsencesQueryVariables,
  CreateAbsenceMutationVariables,
  DeleteAbsenceMutationVariables,
  useCreateAbsenceMutation,
  useDeleteAbsenceMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import { SetSnackBarProp } from "../../../myTypes";
import messageBox from "./messageBox";
import messageBoxDel from "./messageBoxDel";

export default function (setSnackBarProp: SetSnackBarProp) {
  const [createAbsence, result] = useCreateAbsenceMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });

  const mutate = (variables: CreateAbsenceMutationVariables) => {
    createAbsence({
      variables,
      update: (cache, result) => {
        if (result.data) {
          const { createAbsence } = result.data;
          const absenceQuery = cache.readQuery<
            AbsencesQuery,
            AbsencesQueryVariables
          >({
            query: AbsencesDocument,
          });
          if (absenceQuery) {
            const { absences } = absenceQuery;
            cache.writeQuery<AbsencesQuery, AbsencesQueryVariables>({
              query: AbsencesDocument,
              data: { absences: [...createAbsence, ...absences] },
            });
          }
        }
      },
    });
  };
  return { mutate, result };
}
export function useDeleteAbsence(
  setSnackBarProp: SetSnackBarProp,
  set?: React.Dispatch<React.SetStateAction<AbsenceFragment[]>>
) {
  const [deleteAbsence] = useDeleteAbsenceMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBoxDel),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBoxDel),
  });

  return (variables: DeleteAbsenceMutationVariables) => {
    deleteAbsence({
      variables,
      update: (cache, result) => {
        if (result.data) {
          const absenceQuery = cache.readQuery<
            AbsencesQuery,
            AbsencesQueryVariables
          >({
            query: AbsencesDocument,
          });
          if (absenceQuery) {
            const { absences } = absenceQuery;
            const editAbsences = absences.filter(
              (absenceValue) =>
                absenceValue._id !== result.data?.deleteAbsence._id
            );
            if (set) {
              set(editAbsences);
            }
            cache.writeQuery<AbsencesQuery, AbsencesQueryVariables>({
              query: AbsencesDocument,
              data: { absences: editAbsences },
            });
          }
        }
      },
    });
  };
}
