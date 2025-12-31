import "dotenv/config";

async function getTeam(week = null, teamId) {
  const espn_s2 = process.env.ESPN_S2;
  const swid = process.env.SWID;
  const league_id = process.env.LEAGUE_ID;

  try {
    // Build the URL with query parameters
    let url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2026/segments/0/leagues/${league_id}?view=mTeam&view=mRoster`;
    
   
    
    // console.log(`🔍 Fetching team data (size: ${size}, position: ${position || 'all'})...\n`);
    
    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${espn_s2}; SWID=${swid}`
      }
    });
    
    const data = await response.json();

    const team = data.teams.find(t => t.id === teamId);
    console.log(`\n👥 Roster (${team.roster.entries.length} players):\n`);
    
    team.roster.entries.forEach(entry => {
      const player = entry.playerPoolEntry.player;
      const lineupSlot = entry.lineupSlotId; // 0-12 represent different positions
      
      console.log(`- ${player.fullName} (${player.defaultPositionId})`);
      console.log(`  Pro Team ID: ${player.proTeamId}`);
    });

    }catch (error) {
    console.error('❌ Error fetching free agents:', error);
    return [];
  }
}

// Test it
getTeam(null, 2);