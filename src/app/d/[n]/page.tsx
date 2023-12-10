import Link from "next/link";
import { StationPicker } from "./StationPicker";
import { getPrograms } from "lib/getPrograms";

async function getData(n: string) {
  // WHY????
  if (n === "%5Bn%5D") {
    return {
      ok: false,
    };
  }
  return {
    ok: true,
    data: await getPrograms(n),
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
