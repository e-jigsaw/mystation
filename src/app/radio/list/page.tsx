import { db } from "db/db";
import { radio } from "db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const res = await db.query.radio.findMany();
  async function deleteRadio(form: FormData) {
    "use server";
    const id = form.get("id")?.toString();
    if (id) {
      const parsed = Number(id);
      const res = await db.delete(radio).where(eq(radio.id, parsed));
      redirect("/radio/list");
    }
  }
  return (
    <div className="p-2">
      <Link href="/radio/add" className="border p-1 rounded">
        create
      </Link>
      <div className="divide-y">
        {res.map((radio) => (
          <div key={radio.id} className="py-2">
            <form action={deleteRadio}>
              <input name="id" value={radio.id} type="hidden"></input>
              <div className="flex gap-2 items-center">
                <div>
                  {radio.id} |
                  <Link
                    href={`/radio/show/${radio.id}`}
                    className="underline text-sky-500"
                  >
                    {radio.name}
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-red-600 text-white rounded p-1"
                  >
                    delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
