import { integer, pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 512 }).notNull(),
    salt: varchar({ length: 32 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
