import { db } from "db/db";
import Link from "next/link";

export default async function Page() {
  const res = await db.query.programs.findMany({
    with: { radio: true },
    limit: 20,
  });
  return (
    <div className="p-2">
      {res.map((prog) => (
        <div key={prog.id} className="flex gap-1">
          <div>{prog.id}</div>
          <div>
            {prog.pubDate.getMonth() + 1}/{prog.pubDate.getDate()}
          </div>
          <div>
            <Link href={`/radio/show/${prog.radio?.id}`}>
              {prog.radio?.name}
            </Link>{" "}
          </div>
        </div>
      ))}
    </div>
  );
}
