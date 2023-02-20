"use client";
import { unwrapText } from "lib/xml2json";
import { Station } from "types";
import { useCallback, useState } from "react";
import clsx from "clsx";
import { ProgramPicker } from "./ProgramPicker";

export const StationPicker: React.FC<{ stations: Station[] }> = ({
  stations,
}) => {
  const [selected, setSelected] = useState<Station | null>(null);
  const selectStation = useCallback(
    (station: Station) => () => setSelected(station),
    []
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
            <ProgramPicker
              id={selected.id}
              program={program}
              key={program.id}
            ></ProgramPicker>
          ))}
        </div>
      )}
    </div>
  );
};
