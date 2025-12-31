import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { players } from "./db/schema.js";
import "dotenv/config";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("🔌 Connecting to database...");

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Clean up any existing test data first
    console.log("\n🧹 Cleaning up old test data...");
    await db.delete(players).where(eq(players.id, 1));
    console.log("✅ Cleanup complete!");

    // Test 1: Insert a test player
    console.log("\n📝 Inserting test player...");
    await db.insert(players).values({
      id: 1,
      name: "LeBron James",
      team: "LAL",
      position: "SF",
      status: "active",
      fantasyPoints: "45.5",
    });
    console.log("✅ Test player inserted!");

    // Test 2: Query the player back
    console.log("\n🔍 Querying players table...");
    const allPlayers = await db.select().from(players);
    console.log("✅ Found players:", allPlayers);

    // Test 3: Update the player
    console.log("\n✏️ Updating player status...");
    await db.update(players)
      .set({ status: "injured" })
      .where(eq(players.id, 1));
    console.log("✅ Player updated!");

    // Test 4: Query again to verify update
    console.log("\n🔍 Querying updated player...");
    const updatedPlayers = await db.select().from(players);
    console.log("✅ Updated players:", updatedPlayers);

    console.log("\n🎉 All tests passed! Database is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }

  await client.end();
}

testConnection();