import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { usersTable } from './schema';
import { eq } from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client: queryClient });

export default db
// await db.update(usersTable).set({ username: 'darth_vader' }).where(eq(usersTable.email, 'mustafa@example.com'))
