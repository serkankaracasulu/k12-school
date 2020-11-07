import { MutationTuple } from "@apollo/client";

import {
  useAcceptJoinStudyMutation,
  AcceptJoinStudyMutationVariables,
  AcceptJoinStudyMutation,
  StudiesQuery,
  StudiesQueryVariables,
  StudiesDocument,
} from "./../../generated/graphql";

export default function (): [
  { (values: AcceptJoinStudyMutationVariables): void },
  MutationTuple<AcceptJoinStudyMutation, AcceptJoinStudyMutationVariables>[1]
] {
  const [acceptOrDecline, result] = useAcceptJoinStudyMutation({
    onError: () => {},
  });

  function handleAcceptJoinStudy(values: AcceptJoinStudyMutationVariables) {
    const { studyId, studentId, r, status } = values;
    acceptOrDecline({
      variables: { studyId, studentId, r, status },
      update: (proxy, result) => {
        if (result.data && result.data.acceptJoinStudy) {
          const { acceptJoinStudy } = result.data;
          const studiesQuery = proxy.readQuery<
            StudiesQuery,
            StudiesQueryVariables
          >({
            query: StudiesDocument,
          });
          if (studiesQuery) {
            const { studies } = studiesQuery;
            const editStudies = studies.map((studyValue) => {
              if (studyValue._id === acceptJoinStudy._id)
                return acceptJoinStudy;
              else return studyValue;
            });

            proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
              query: StudiesDocument,
              data: { studies: editStudies },
            });
          }
        }
      },
    });
  }
  return [handleAcceptJoinStudy, result];
}
