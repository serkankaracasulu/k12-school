import * as React from "react";
import { useParams } from "react-router-dom";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  ParentsDocument,
  ParentsQuery,
  ParentsQueryVariables,
  useRemoveParentMutation,
  UserFragment,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import Context from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import messageBox from "./messageBoxRemove";

type PropsType = {
  setOpen(): void;
  parent: UserFragment;
};

type ParamType = {
  studentId: string;
};

export default function RemoveParentForm(props: PropsType) {
  const { setOpen, parent } = props;
  const { setPr } = React.useContext(Context);
  const { studentId } = useParams<ParamType>();
  const [removeParent, { loading }] = useRemoveParentMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
    },
  });
  const handleRemove = () => {
    removeParent({
      variables: { parentId: parent._id, studentId },
      update: (proxy, result) => {
        if (result.data && result.data.removeParent.success) {
          const parentQuery = proxy.readQuery<
            ParentsQuery,
            ParentsQueryVariables
          >({ query: ParentsDocument, variables: { studentId } });
          if (parentQuery) {
            const { studentParents } = parentQuery;
            const parents = studentParents.filter(
              (parentValue) => parentValue._id !== result.data?.removeParent._id
            );
            proxy.writeQuery<ParentsQuery, ParentsQueryVariables>({
              query: ParentsDocument,
              variables: { studentId },
              data: { studentParents: parents },
            });
          }
        }
      },
    });
  };
  return (
    <DialogWrapper
      title="Veli Çıkart"
      setOpen={setOpen}
      maxWidth="sm"
      loading={loading}
    >
      <Typography variant="body1" gutterBottom>
        {parent.fullName}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {"T.C: "} {parent.citizenshipId}
      </Typography>
      <Typography variant="caption" gutterBottom>
        * Veli tamamen silinmeyecek, kişi artık öğrencinin velisi olmayacak
      </Typography>
      <DialogActions>
        <Button>İPTAL</Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={handleRemove}
        >
          ÇIKART
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
