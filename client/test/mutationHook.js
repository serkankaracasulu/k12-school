import React, { useState, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {} from "";
export default function (query, variables) {
  const [signinUser, { loading, data }] = useMutation(query, {
    onError: (err) => {
      return err;
    },
    ignoreResults: false,
    onCompleted: (tData) => {
      return tData;
    },
  });
  const mutation = useCallback(() => signinUser(variables), []);
  return { data, mutation };
}
