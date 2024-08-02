import { db } from "db/db";
import { radio } from "db/schema";
import { eq } from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const _radio = await db.query.radio.findFirst({
    with: { programs: true },
    where: eq(radio.id, Number(params.id)),
  });
  console.log(_radio);
  return <div className="p-2">hey</div>;
}
