import { range } from "rambda";
import { subDays, format } from "date-fns";
import Link from "next/link";

export default function Page() {
  const today = new Date();
  const week = range(0, 8)
    .reverse()
    .map((sub) => {
      const day = subDays(today, sub);
      return {
        num: day.getTime(),
        formatted: format(day, "MM/dd"),
      };
    });
  return (
    <div className="flex justify-around h-screen items-center">
      {week.map((day) => (
        <Link href={`/d/${day.num}`} key={day.num} className="block text-5xl">
          {day.formatted}
        </Link>
      ))}
    </div>
  );
}
