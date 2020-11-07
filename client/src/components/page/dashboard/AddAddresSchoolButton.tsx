import * as React from "react";

import { Button } from "@material-ui/core";

import {
  AddAddressToSchoolMutationVariables,
  SchoolDocument,
  SchoolQuery,
  SchoolQueryVariables,
  useAddAddressToSchoolMutation,
} from "../../../generated/graphql";

export default function AddAddressButton(
  props: AddAddressToSchoolMutationVariables
) {
  const [addAddress] = useAddAddressToSchoolMutation({ onError: () => {} });
  const handleAdd = () => {
    addAddress({
      variables: props,
      update: (cache, mutationResult) => {
        const { data: mutationData } = mutationResult;
        const schoolQuery = cache.readQuery<SchoolQuery, SchoolQueryVariables>({
          query: SchoolDocument,
          variables: { id: props.schoolId },
        });
        if (mutationData && mutationData.addAddressToSchool && schoolQuery) {
          const { school } = schoolQuery;
          const mutateSchool: SchoolQuery["school"] = {
            ...school,
            address: mutationData.addAddressToSchool,
          };
          cache.writeQuery<SchoolQuery, SchoolQueryVariables>({
            query: SchoolDocument,
            variables: { id: props.schoolId },
            data: {
              school: mutateSchool,
            },
          });
        }
      },
    });
  };
  return <Button onClick={handleAdd}>Konum güncelle</Button>;
}
