import * as React from "react";

import {
  RemoveVoyageTimeMutationVariables,
  useRemoveVoyageTimeMutation,
  VoyagesDocument,
  VoyagesQuery,
  VoyagesQueryVariables,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../../helper/generateMessage";
import Context from "../../../../../Context";
import DialogYesNo from "../../../../../DialogYesNo";
import messageBox from "./messageBox";

type PropsType = {
  setOpen(): void;
  variables: RemoveVoyageTimeMutationVariables;
};

export default function RemoveVoyageTimeDialog({
  setOpen,
  variables,
}: PropsType) {
  const { setPr } = React.useContext(Context);
  const [remove] = useRemoveVoyageTimeMutation({
    onError: (tError) => generateError(tError, setPr, messageBox),
    onCompleted: (tData) =>
      tData.removeVoyageTime.success && generateSuccess(setPr, messageBox),
  });
  const handleRemove = () => {
    remove({
      variables,
      update: (proxy, result) => {
        try {
          if (!result.data?.removeVoyageTime.success) return;
          const voyageQuery = proxy.readQuery<
            VoyagesQuery,
            VoyagesQueryVariables
          >({
            query: VoyagesDocument,
          });
          if (!voyageQuery) return;
          const voyages = voyageQuery.voyages.map((voyage) => {
            if (voyage._id === variables.voyageId) {
              const voyageTimes = voyage.voyageTimes.filter(
                (time) => time._id !== variables.timeId
              );
              return { ...voyage, voyageTimes };
            }
            return voyage;
          });
          proxy.writeQuery<VoyagesQuery, VoyagesQueryVariables>({
            query: VoyagesDocument,
            data: { voyages },
          });
        } catch (error) {
          //
        }
      },
    });
  };
  return (
    <DialogYesNo
      title="Sefer Silme"
      primaryText="Bu seferi silmek istediğinizden istediğinizden emin misiniz?"
      handleYes={handleRemove}
      setClose={setOpen}
    />
  );
}
