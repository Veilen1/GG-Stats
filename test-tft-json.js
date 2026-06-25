async function run() {
  const version = '16.13.1';
  const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/tft-trait.json`);
  const json = await res.json();
  
  const traits = json.data;
  
  const toCheck = ["TFT17_ASTrait", "TFT17_AnimaSquad", "TFT12_Vanguard", "TFT17_SpaceGroove"];
  
  for (const id of toCheck) {
    const trait = traits[id];
    if (trait && trait.image && trait.image.full) {
      const url = `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-trait/${trait.image.full}`;
      console.log(`${id} maps to ${trait.image.full}`);
      
      const imgRes = await fetch(url, { method: 'HEAD' });
      console.log(`  -> URL: ${url}`);
      console.log(`  -> Status: ${imgRes.status}`);
    } else {
      console.log(`${id} not found in tft-trait.json or missing image!`);
    }
  }
}
run();
