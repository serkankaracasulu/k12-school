import React from "react";

export const useFocus = () => {
  const htmlElRef = React.useRef<HTMLInputElement | null>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  let returnArray: [
    React.MutableRefObject<HTMLInputElement | null>,
    () => void
  ] = [htmlElRef, setFocus];
  return returnArray;
};
