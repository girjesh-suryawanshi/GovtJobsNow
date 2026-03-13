import('dotenv/config');
import { db } from './server/db.js';
import { adminUsers } from './shared/schema.js';

async function checkAdmin() {
    try {
        const users = await db.select().from(adminUsers);
        console.log("Found admins:", users);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkAdmin();
