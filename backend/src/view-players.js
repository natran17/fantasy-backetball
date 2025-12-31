import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { players } from "./db/schema.js";

async function viewPlayers() {
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    const allPlayers = await db.select().from(players);
    
    console.log(`📊 Total players in database: ${allPlayers.length}\n`);
    
    console.log('Sample players:');
    allPlayers.slice(0, 10).forEach(p => {
      console.log(`- ${p.name} (${p.position}) - ${p.team} - ${p.fantasyPoints} pts`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

viewPlayers();