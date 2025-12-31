import "dotenv/config";

async function getFreeAgents(week = null, size = 50, position = null) {
  const espn_s2 = process.env.ESPN_S2;
  const swid = process.env.SWID;
  const league_id = process.env.LEAGUE_ID;

  try {
    // Build the URL with query parameters
    let url = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2026/segments/0/leagues/${league_id}?view=kona_player_info`;
    
    // Add optional parameters
    if (size) url += `&limit=${size}`;
    if (position) url += `&filterSlotIds=${position}`;
    
    console.log(`🔍 Fetching free agents (size: ${size}, position: ${position || 'all'})...\n`);
    
    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${espn_s2}; SWID=${swid}`
      }
    });
    
    const data = await response.json();
    console.log(data)
    
    // Extract free agents (players not on any team)
    const freeAgents = data.players?.filter(player => 
      player.onTeamId === 0 || !player.onTeamId
    ) || [];
    
    console.log(`✅ Found ${freeAgents.length} free agents`);
    
    // Print some examples
    freeAgents.slice(0, 10).forEach(player => {
      console.log(`- ${player.players}`);
    });


    const fs = await import('fs');
    fs.writeFileSync('free-agents-data.json', JSON.stringify(data, null, 2));
    
    return freeAgents;
    
  } catch (error) {
    console.error('❌ Error fetching free agents:', error);
    return [];
  }
}

// Test it
getFreeAgents(null, 20, 'PG');