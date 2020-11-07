import * as React from "react";

import { Button } from "@material-ui/core";

import {
  AddVoyageTimeMutationVariables,
  useAddVoyageTimeMutation,
  VoyagesDocument,
  VoyagesQuery,
  VoyagesQueryVariables,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../../helper/generateMessage";
import Context from "../../../../../Context";
import messageBox from "./messageBox";

type PropsType = {
  variables: AddVoyageTimeMutationVariables;
};
export default function AddVoyageTimeButton({ variables }: PropsType) {
  const { setPr } = React.useContext(Context);
  const [add, { loading, data }] = useAddVoyageTimeMutation({
    onError: (tError) => generateError(tError, setPr, messageBox),
    onCompleted: (tData) => generateSuccess(setPr, messageBox),
  });
  const handleRemove = () => {
    add({
      variables,
      update: (proxy, result) => {
        if (!result.data) return;
        const { addVoyageTime } = result.data;
        try {
          const voyageQuery = proxy.readQuery<
            VoyagesQuery,
            VoyagesQueryVariables
          >({
            query: VoyagesDocument,
          });
          if (!voyageQuery) return;
          const voyages = voyageQuery.voyages.map((voyage) => {
            if (voyage._id === variables.voyageId) {
              const voyageTimes = [...voyage.voyageTimes, addVoyageTime].sort(
                (a, b) => {
                  if (a.day < b.day) return -1;
                  else if (a.day === b.day) {
                    if (a.hour.valueOf() < b.hour.valueOf()) return -1;
                    else return 0;
                  }
                  return 0;
                }
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
    <Button onClick={handleRemove} disabled={loading || !!data}>
      EKLE
    </Button>
  );
}
