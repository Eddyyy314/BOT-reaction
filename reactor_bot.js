const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── CONFIG ───────────────────────────────────────────────
const EMOJIS = ["❤️", "🔥", "😂", "💀", "😮"];

const COMMENTS = [
  "palese","clamoroso","true af","no cap","assurdo","this is so real",
  "lowkey d'accordo","fr fr","bro has a point","non potevo dirlo meglio",
  "too real","finalmente qualcuno lo dice","letteralmente io",
  "dipende ma tendenzialmente sì","based","W take","hard agree"
];

const FAKE_AUTHORS = [
  "VectorVoid38",
  "NeonPulse72",
  "ShadowByte14",
  "QuantumRush56",
  "PixelNova83",
  "EchoBlaze29",
  "CyberDrift91",
  "NovaFlux47",
  "AlphaGlitch65",
  "TurboVortex22",
  "HyperNova39",
  "ZenithByte58",
  "OmegaPulse74",
  "DeltaPhantom11",
  "CrimsonVector90",
  "LunarShift36",
  "GhostMatrix81",
  "AeroBlitz27",
  "FusionSpark64",
  "BinaryStorm52",
  "SolarByte19",
  "VoidRunner88",
  "CyberEcho33",
  "NeonStriker70",
  "PulseRider45",
  "AstroFlare92",
  "TitanGlitch16",
  "RapidQuantum61",
  "EchoVortex08",
  "DarkNova77",
  "StormPixel25",
  "FluxPhantom69",
  "ShadowCircuit41",
  "NovaRift53",
  "VectorBlaze84",
  "GlitchHunter37",
  "ByteCrusher20",
  "HyperCircuit66",
  "PhantomPulse49",
  "TurboEcho95",
  "ZenithStorm13",
  "CosmicDrift57",
  "NeonPhantom82",
  "ApexVector24",
  "QuantumBlaze73"
];

// ─── PARAMETRI SCALABILITÀ ────────────────────────────────
const TOTAL_REACTIONS = 1000;
const BATCH_SIZE = 50;
const COMMENT_PROBABILITY = 0.2;
const COMMENT_REACTION_PROBABILITY = 0.3;

// ─── HELPERS ──────────────────────────────────────────────
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function randomDelay() {
  return Math.floor(Math.random() * 200); // 0–200ms
}

function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── FETCH ────────────────────────────────────────────────
async function getRecentPosts(limit = 100) {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Errore fetch posts:", error);
    return [];
  }

  return data;
}

async function getRecentComments(limit = 50) {
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Errore fetch comments:", error);
    return [];
  }

  return data;
}

// ─── BULK REACTIONS ───────────────────────────────────────
async function insertReactionsBatch(posts, size) {
  const payload = [];

  for (let i = 0; i < size; i++) {
    const post = pickRandom(posts);

    payload.push({
      post_id: post.id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
    });
  }

  const { error } = await supabase.from("reactions").insert(payload);

  if (error) {
    console.error("Errore bulk reactions:", error.message);
  } else {
    console.log(`🚀 +${size} reactions`);
  }
}

// ─── BULK COMMENTS ────────────────────────────────────────
async function insertCommentsBatch(posts, size) {
  const payload = [];

  for (let i = 0; i < size; i++) {
    const post = pickRandom(posts);

    payload.push({
      post_id: post.id,
      text: pickRandom(COMMENTS),
      author: pickRandom(FAKE_AUTHORS),
      language: "it",
      category: "Opinione",
      mood: "Bored",
    });
  }

  const { error } = await supabase.from("comments").insert(payload);

  if (error) {
    console.error("Errore bulk comments:", error.message);
  } else {
    console.log(`💬 +${size} comments`);
  }
}

// ─── COMMENT REACTIONS ────────────────────────────────────
async function insertCommentReactions(comments, size) {
  const payload = [];

  for (let i = 0; i < size; i++) {
    const c = pickRandom(comments);

    payload.push({
      comment_id: c.id,
      post_id: c.post_id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
      reactor_name: pickRandom(FAKE_AUTHORS),
    });
  }

  const { error } = await supabase
    .from("comment_reactions")
    .insert(payload);

  if (error) {
    console.error("Errore reactions commenti:", error.message);
  } else {
    console.log(`🔥 +${size} comment reactions`);
  }
}

// ─── MAIN ENGINE ──────────────────────────────────────────
async function main() {
  console.log("🤖 BOT ULTRA AVVIATO");

  const posts = await getRecentPosts();
  if (!posts.length) return console.log("No posts.");

  const comments = await getRecentComments();

  let done = 0;

  while (done < TOTAL_REACTIONS) {
    // REACTIONS
    await insertReactionsBatch(posts, BATCH_SIZE);
    done += BATCH_SIZE;

    // COMMENTI RANDOM
    if (Math.random() < COMMENT_PROBABILITY) {
      await insertCommentsBatch(posts, Math.floor(BATCH_SIZE / 2));
    }

    // REACTIONS AI COMMENTI
    if (comments.length && Math.random() < COMMENT_REACTION_PROBABILITY) {
      await insertCommentReactions(comments, Math.floor(BATCH_SIZE / 2));
    }

    console.log(`⚡ Progress: ${done}/${TOTAL_REACTIONS}`);

    // delay umano
    await sleep(randomDelay());
  }

  console.log("✅ BOT FINITO");
}

main();
