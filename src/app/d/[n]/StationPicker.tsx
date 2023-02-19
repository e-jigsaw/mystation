"use client";
import { unwrapText } from "lib/xml2json";
import { Program, Station } from "types";
import { useCallback, useState } from "react";
import clsx from "clsx";
import React from "react";

export const StationPicker: React.FC<{ stations: Station[] }> = ({
  stations,
}) => {
  const [selected, setSelected] = useState<Station | null>(null);
  const selectStation = useCallback(
    (station: Station) => () => setSelected(station),
    []
  );
  const selectProgram = useCallback(
    (program: Program) => async () => {
      if (selected) {
        fetch("/api/save", {
          method: "POST",
          body: JSON.stringify({
            ft: program.ft,
            title: unwrapText(program.title),
            id: selected.id,
          }),
        });
      }
    },
    [selectStation]
  );
  return (
    <div>
      <div className="grid grid-cols-4 mx-4">
        {stations.map((station) => (
          <div
            key={station.id}
            onClick={selectStation(station)}
            className={clsx(
              "cursor-pointer",
              selected && selected.id === station.id && "text-black",
              selected && selected.id !== station.id && "text-gray-300"
            )}
          >
            {unwrapText(station.name)}
          </div>
        ))}
      </div>
      {selected && (
        <div className="grid grid-cols-3">
          {selected.progs.prog.map((program) => (
            <div
              key={program.id}
              className="my-4 mx-4 border border-gray-400 border-solid rounded p-2 cursor-pointer"
              onClick={selectProgram(program)}
            >
              <div className="text-xl">{unwrapText(program.title)}</div>
              <div className="text-xs text-gray-400 mb-2">
                {unwrapText(program.pfm)}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: unwrapText(program.info) }}
                className="text-sm"
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
