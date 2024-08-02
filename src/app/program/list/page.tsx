import { db } from "db/db";

export default async function Page() {
  const res = await db.query.programs.findMany({ with: { radio: true } });
  console.log(res);
  return <div className="p-2">works!</div>;
}
