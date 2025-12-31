import "dotenv/config";

async function testESPNAPI() {
  const espn_s2 = process.env.ESPN_S2;
  const swid = process.env.SWID;
  const league_id = process.env.LEAGUE_ID;

  try {
    console.log('Fetching from ESPN Fantasy API...\n');
    
    const league = await fetch(
      `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2026/segments/0/leagues/${league_id}`,
      {
        headers: {
          'Cookie': `espn_s2=${espn_s2}; SWID=${swid}`
        }
      }
    );
    const data = await league.json();
    console.log('\n📊 League Info:');
    console.log('Name:', data.settings?.name);
    console.log('Size:', data.settings?.size, 'teams');
    console.log('Season:', data.seasonId);
    
    // Print teams
    console.log('\n👥 Teams:');
    data.teams?.forEach(team => {
      console.log(`- ${team.abbrev}`);
    });
    
    // Save full response to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('league-data.json', JSON.stringify(data, null, 2));
    console.log('\n💾 Full data saved to league-data.json');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testESPNAPI();