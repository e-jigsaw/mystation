import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  json,
  text,
  integer,
} from "drizzle-orm/pg-core";

export type ProgramBody = {
  url: string;
  size: number;
};

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  body: json("body").notNull().$type<ProgramBody>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  radioId: integer("radioId"),
  pubDate: timestamp("pubDate").defaultNow().notNull(),
});

export const radio = pgTable("radio", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const radioRelations = relations(radio, ({ many }) => ({
  programs: many(programs),
}));

export const programRelations = relations(programs, ({ one }) => ({
  radio: one(radio, {
    fields: [programs.radioId],
    references: [radio.id],
  }),
}));
