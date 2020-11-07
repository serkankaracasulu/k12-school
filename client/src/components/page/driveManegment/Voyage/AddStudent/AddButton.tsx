import * as React from "react";

import { Button } from "@material-ui/core";

import {
  AddStudentVoyageMutationVariables,
  useAddStudentVoyageMutation,
  VoyagesDocument,
  VoyagesQuery,
  VoyagesQueryVariables,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import Context from "../../../../Context";
import messageBox from "./messageBox";

type PropsType = {
  variables: AddStudentVoyageMutationVariables;
};

export default function VoyageAddStudentButton({ variables }: PropsType) {
  const { setPr } = React.useContext(Context);
  const [add, { loading }] = useAddStudentVoyageMutation({
    onError: (tError) => generateError(tError, setPr, messageBox),
    onCompleted: (tData) =>
      tData.addStudentVoyage.success && generateSuccess(setPr, messageBox),
  });
  const handleAdd = () => {
    add({
      variables,
      update: (proxy, result) => {
        if (!result.data?.addStudentVoyage.success) return;
        const voyagesQuery = proxy.readQuery<
          VoyagesQuery,
          VoyagesQueryVariables
        >({ query: VoyagesDocument });
        if (!voyagesQuery) return;
        const voyages = voyagesQuery.voyages.map((voyage) => {
          if (voyage._id === variables.voyageId) {
            const studentIds = [variables.studentId, ...voyage.studentIds];
            return { ...voyage, studentIds };
          }
          return voyage;
        });
        proxy.writeQuery<VoyagesQuery, VoyagesQueryVariables>({
          query: VoyagesDocument,
          data: { voyages },
        });
      },
    });
  };
  return (
    <Button
      color="primary"
      onClick={handleAdd}
      variant="contained"
      disabled={!variables.studentId || loading}
    >
      EKLE
    </Button>
  );
}
