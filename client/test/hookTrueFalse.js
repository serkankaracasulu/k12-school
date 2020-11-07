import React, { useState, useCallback } from "react";

export default function(defValue) {
  const [open, setOpen] = useState(defValue);

  const setValue = useCallback(value => setOpen(value), []);
  return { open, setValue };
}
