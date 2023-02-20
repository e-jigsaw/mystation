"use client";

import { unwrapText } from "lib/xml2json";
import { useCallback, useState } from "react";
import { Program } from "types";
import clsx from "clsx";

export const ProgramPicker: React.FC<{ id: string; program: Program }> = ({
  id,
  program,
}) => {
  const [stat, setStat] = useState("");
  const onClick = useCallback(async () => {
    setStat("fetching...");
    const res = await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({
        ft: program.ft,
        title: unwrapText(program.title),
        id,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setStat("fetched");
    } else {
      setStat("err!");
    }
  }, [id, program]);
  return (
    <div
      className="my-4 mx-4 border border-gray-400 border-solid rounded p-2 cursor-pointer"
      onClick={onClick}
    >
      <div className={clsx(stat.length === 0 && "hidden", "text-xs")}>
        {stat}
      </div>
      <div className="text-xl">{unwrapText(program.title)}</div>
      <div className="text-xs text-gray-400 mb-2">
        {unwrapText(program.pfm)}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: unwrapText(program.info) }}
        className="text-sm"
      ></div>
    </div>
  );
};
