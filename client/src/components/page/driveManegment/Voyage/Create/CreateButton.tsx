import * as React from "react";

import { Button } from "@material-ui/core";

import {
  CreateVoyageMutationVariables,
  useCreateVoyageMutation,
  VoyagesDocument,
  VoyagesQuery,
  VoyagesQueryVariables,
} from "../../../../../generated/graphql";

type PropsType = {
  variables: CreateVoyageMutationVariables;
  disabled?: boolean;
  setError(result: boolean): void;
  onClick(): void;
};
export default function DriveVoyageCreateButton({
  variables,
  disabled,
  setError,
  onClick,
}: PropsType) {
  const [create] = useCreateVoyageMutation({
    onError: () => setError(true),
    onCompleted: () => onClick(),
  });
  const handleCreate = () => {
    create({
      variables,
      update: (proxy, result) => {
        if (!result || !result.data) return;

        try {
          const voyageQuery = proxy.readQuery<
            VoyagesQuery,
            VoyagesQueryVariables
          >({
            query: VoyagesDocument,
          });
          if (!voyageQuery) return;
          proxy.writeQuery<VoyagesQuery, VoyagesQueryVariables>({
            query: VoyagesDocument,
            data: {
              voyages: [result.data.createVoyage, ...voyageQuery.voyages],
            },
          });
        } catch (error) {
          //
        }
      },
    });
  };
  return (
    <Button onClick={handleCreate} variant="contained" disabled={disabled}>
      BİTİR
    </Button>
  );
}
