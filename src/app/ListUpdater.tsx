"use client";

import { useCallback } from "react";

export const ListUpdater = () => {
  const onClick = useCallback(async () => {
    const res = await fetch("/api/list", {
      method: "PUT",
    });
    const json = await res.json();
    console.log(json);
  }, []);
  return <button onClick={onClick}>update list</button>;
};
