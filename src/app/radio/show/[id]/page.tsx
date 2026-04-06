import { db } from "db/db";
import { radio } from "db/schema";
import { eq } from "drizzle-orm";

export default async function Page({ params }: { params: { id: string } }) {
  const _radio = await db.query.radio.findFirst({
    with: { programs: true },
    where: eq(radio.id, Number(params.id)),
  });
  return (
    <div className="p-2">
      <div>{_radio?.id}</div>
      <div>{_radio?.name}</div>
    </div>
  );
}
