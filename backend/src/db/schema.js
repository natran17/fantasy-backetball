import { pgTable, integer, varchar, timestamp, decimal } from "drizzle-orm/pg-core";

// Players table - stores data from ESPN API
export const players = pgTable("players", {
  id: integer("id").primaryKey(), // ESPN player ID
  name: varchar("name", { length: 255 }).notNull(),
  team: varchar("team", { length: 10 }), // team abbreviation (LAL, BOS, etc)
  position: varchar("position", { length: 10 }), // PG, SG, SF, PF, C
  status: varchar("status", { length: 50 }), // active, injured, out, questionable
  fantasyPoints: decimal("fantasy_points", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});