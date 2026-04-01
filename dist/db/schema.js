"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)('users', {
    // uuid = unique ID, auto-generated 
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 45 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 45 }), //optional!
    email: (0, pg_core_1.varchar)('email', { length: 322 }).notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)('email_verified').default(false).notNull(),
    //password and salt stored separately 
    password: (0, pg_core_1.varchar)('password', { length: 66 }),
    salt: (0, pg_core_1.text)('salt'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').$onUpdate(() => new Date()),
});
