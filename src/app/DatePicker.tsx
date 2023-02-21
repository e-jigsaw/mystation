"use client";
import { range } from "rambda";
import { subDays, format } from "date-fns";
import Link from "next/link";

export const DatePicker = () => {
  const today = new Date();
  const week = range(0, 8)
    .reverse()
    .map((sub) => {
      const day = subDays(today, sub);
      return {
        num: day.getTime(),
        formatted: format(day, "MM/dd"),
        doe: format(day, "eee"),
      };
    });
  return (
    <div className="flex justify-around h-screen items-center">
      {week.map((day) => (
        <Link href={`/d/${day.num}`} key={day.num} className="block">
          <div className="text-5xl">{day.formatted}</div>
          <div className="text-base">{day.doe}</div>
        </Link>
      ))}
    </div>
  );
};
