import * as React from "react";

import {
  RemoveStudentVoyageMutationVariables,
  useRemoveStudentVoyageMutation,
  VoyagesDocument,
  VoyagesQuery,
  VoyagesQueryVariables,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import Context from "../../../../Context";
import DialogYesNo from "../../../../DialogYesNo";
import messageBox from "./messageBox";

type PropsType = {
  setOpen(): void;
  variables: RemoveStudentVoyageMutationVariables;
};

export default function RemoveStudentVoyageDialog({
  setOpen,
  variables,
}: PropsType) {
  const { setPr } = React.useContext(Context);
  const [remove] = useRemoveStudentVoyageMutation({
    onError: (tError) => generateError(tError, setPr, messageBox),
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
  });
  const handleRemove = () => {
    remove({
      variables,
      update: (proxy, result) => {
        if (!result.data) return;
        const voyagesQuery = proxy.readQuery<
          VoyagesQuery,
          VoyagesQueryVariables
        >({ query: VoyagesDocument });
        if (!voyagesQuery) return;
        const voyages = voyagesQuery.voyages.map((voyage) => {
          if (voyage._id === variables.voyageId) {
            const studentIds = voyage.studentIds.filter(
              (s) => s !== variables.studentId
            );
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
    <DialogYesNo
      title="Öğrenci Servisten Çıkarma"
      primaryText="Öğrenciyi servisten çıkarmak istediğinizden emin misiniz?"
      handleYes={handleRemove}
      setClose={setOpen}
    />
  );
}
