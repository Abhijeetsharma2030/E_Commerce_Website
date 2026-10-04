import { connectDB } from "../lib/db.js";
import { User } from "../models/User.js";

const username = process.argv[2];

if (!username) {
  console.error("Usage: node --env-file=.env.local scripts/make-admin.js <username>");
  process.exit(1);
}

await connectDB();

const user = await User.findOneAndUpdate(
  { username },
  { role: "admin" },
  { returnDocument: "after" }
);

if (!user) {
  console.error(`No user found with username "${username}"`);
  process.exit(1);
}

console.log(`✓ ${user.username} (${user.email}) is now an admin.`);
process.exit(0);
