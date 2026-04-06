import { db } from "db/db";
import { radio } from "db/schema";
import { redirect } from "next/navigation";

export default async function Page() {
  async function create(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    if (!name) {
      throw new Error("name not found");
    }

    const res = await db
      .insert(radio)
      .values({
        name,
      })
      .returning();

    redirect("/radio/list");
  }
  return (
    <div className="p-2">
      <form action={create}>
        <label htmlFor="name">name:</label>
        <input id="name" name="name" className="border"></input>
        <div>
          <button type="submit" className="">
            submit
          </button>
        </div>
      </form>
    </div>
  );
}
