import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { players } from "./db/schema.js";

// Position mapping
const POSITIONS = {
  0: 'PG',
  1: 'SG', 
  2: 'SF',
  3: 'PF',
  4: 'C',
  5: 'G',
  6: 'F'
};

// NBA Team mapping
const TEAMS = {
  1: 'ATL', 2: 'BOS', 3: 'BKN', 4: 'CHA', 5: 'CHI', 
  6: 'CLE', 7: 'DAL', 8: 'DEN', 9: 'DET', 10: 'GSW',
  11: 'HOU', 12: 'IND', 13: 'LAC', 14: 'LAL', 15: 'MEM',
  16: 'MIA', 17: 'MIL', 18: 'MIN', 19: 'NOP', 20: 'NYK',
  21: 'OKC', 22: 'ORL', 23: 'PHI', 24: 'PHX', 25: 'POR',
  26: 'SAC', 27: 'SAS', 28: 'TOR', 29: 'UTA', 30: 'WAS'
};

async function getAllRosteredPlayers() {
  const espn_s2 = process.env.ESPN_S2;
  const swid = process.env.SWID;
  const league_id = process.env.LEAGUE_ID;

  if (!espn_s2 || !swid || !league_id) {
    throw new Error('Missing credentials in .env');
  }

  try {
    console.log('Fetching all teams and rosters ...\n');
    
    const url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2026/segments/0/leagues/${league_id}?view=mTeam&view=mRoster`;
    
    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${espn_s2}; SWID=${swid}`
      }
    });
    
    const data = await response.json();
    
    if (data.messages) {
      console.error('❌ ESPN API Error:', data.messages);
      return [];
    }

    console.log(`✅ Found ${data.teams.length} teams\n`);

    // Collect all players from all teams
    const allPlayers = [];
    
    data.teams.forEach(team => {
      console.log(`📋 ${team.location} ${team.nickname} (${team.roster.entries.length} players)`);
      
      team.roster.entries.forEach(entry => {
        const player = entry.playerPoolEntry.player;
        allPlayers.push(player);
      });
    });

    console.log(`\n✅ Total rostered players: ${allPlayers.length}\n`);
    
    return allPlayers;
    
  } catch (error) {
    console.error('❌ Error fetching from ESPN:', error);
    return [];
  }
}

function parsePlayer(espnPlayer) {
  const currentSeasonStats = espnPlayer.stats?.find(
    s => s.seasonId === 2026 && s.statSplitTypeId === 0
  );
  
  return {
    id: espnPlayer.id,
    name: espnPlayer.fullName || `${espnPlayer.firstName} ${espnPlayer.lastName}`,
    team: TEAMS[espnPlayer.proTeamId] || 'FA',
    position: POSITIONS[espnPlayer.defaultPositionId] || 'UTIL',
    status: espnPlayer.injuryStatus || 'ACTIVE',
    fantasyPoints: currentSeasonStats?.appliedAverage?.toFixed(2) || '0.00',
  };
}

async function savePlayersToDatabase(espnPlayers) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log('💾 Connecting to database...\n');

  const client = postgres(connectionString);
  const db = drizzle(client);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  try {
    for (const espnPlayer of espnPlayers) {
      const playerData = parsePlayer(espnPlayer);
      
      try {
        // Check if player already exists
        const existing = await db
          .select()
          .from(players)
          .where(eq(players.id, playerData.id));

        if (existing.length > 0) {
          // Update existing player
          await db
            .update(players)
            .set({
              name: playerData.name,
              team: playerData.team,
              position: playerData.position,
              status: playerData.status,
              fantasyPoints: playerData.fantasyPoints,
            })
            .where(eq(players.id, playerData.id));
          
          updated++;
          console.log(`✏️  Updated: ${playerData.name} (${playerData.position})`);
        } else {
          // Insert new player
          await db.insert(players).values(playerData);
          inserted++;
          console.log(`➕ Inserted: ${playerData.name} (${playerData.position})`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error saving ${playerData.name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ➕ Inserted: ${inserted} players`);
    console.log(`   ✏️  Updated: ${updated} players`);
    console.log(`   ❌ Errors: ${errors} players`);
    console.log('\n✅ Database sync complete!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('🚀 Starting Fantasy Teams sync...\n');
  
  // Fetch all rostered players from ESPN
  const rosteredPlayers = await getAllRosteredPlayers();
  
  if (rosteredPlayers.length === 0) {
    console.log('⚠️  No rostered players found. Exiting.');
    return;
  }

  // Show first few examples
  console.log('📋 Sample players:');
  rosteredPlayers.slice(0, 5).forEach(p => {
    console.log(`   - ${p.fullName} (${POSITIONS[p.defaultPositionId]})`);
  });
  console.log('');

  // Save to database
  await savePlayersToDatabase(rosteredPlayers);
}

main();