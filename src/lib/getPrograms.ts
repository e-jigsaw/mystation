import { RadikoPack } from "types";
import { xml2json } from "./xml2json";
import format from "date-fns/format";

export const getPrograms = async (n: string) => {
  const date = new Date(parseInt(n));
  const res = await fetch(
    `https://radiko.jp/v3/program/date/${format(date, "yyyyMMdd")}/JP13.xml`
  );
  const xml = await res.text();
  return xml2json(xml) as RadikoPack;
};
