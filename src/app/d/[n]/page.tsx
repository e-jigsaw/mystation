import { format } from "date-fns";
import { xml2json } from "lib/xml2json";
import Link from "next/link";
import { StationPicker } from "./StationPicker";
import { RadikoPack } from "types";

async function getData(n: string) {
  // WHY????
  if (n === "%5Bn%5D") {
    return {
      ok: false,
    };
  }
  const date = new Date(parseInt(n));
  const res = await fetch(
    `https://radiko.jp/v3/program/date/${format(date, "yyyyMMdd")}/JP13.xml`
  );
  const xml = await res.text();
  return {
    ok: true,
    data: xml2json(xml) as RadikoPack,
  };
}

export default async function Page({ params }: { params: { n: string } }) {
  const res = await getData(params.n);
  return (
    <div>
      <div className="text-center my-4">
        <Link href="/" className="text-5xl border border-gray-400 p-2 rounded">
          Select Date
        </Link>
      </div>
      {res.data && (
        <StationPicker
          stations={res.data.radiko.stations.station}
        ></StationPicker>
      )}
    </div>
  );
}
