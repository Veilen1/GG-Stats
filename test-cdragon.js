async function run() {
  const res = await fetch('https://raw.communitydragon.org/latest/game/assets/characters/tft17_kayn/hud/');
  const data = await res.text();
  console.log(data);
}
run();
