const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── CONFIG ───────────────────────────────────────────────
const EMOJIS = ["❤️", "🔥", "😂", "💀", "😮"];

const COMMENTS = [
  "palese",
  "clamoroso",
  "no cap",
  "fr fr",
  "true af",
  "assurdo davvero",
  "this is so real",
  "lowkey d'accordo",
  "bro has a point",
  "non potevo dirlo meglio",
  "too real onestamente",
  "finalmente qualcuno lo dice",
  "letteralmente io",
  "dipende ma ci sta",
  "based take",
  "W take",
  "questa è un hard agree",
  "questa è verità pura",
  "HAHAHAHA",
  "ok questo è pesante",
  "mi rappresenta troppo",
  "sto MALE",
  "non posso negarlo",
  "è proprio così",
  "facts",
  "FACTSSS",
  "ABSOLUTE CINEMA",
  "capisco benissimo",
  "è esattamente così",
  "AHAHAHAHAHAHA",
  "giusto così",
  "boh sì ci sta",
  "eh sì purtroppo",
  "mah sì",
  "okkk assurdo",
  "lol vero",
  "ok questo è troppo",
  "non ce la faccio",
  "verissimo",
  "no vabbè ma come ti è uscita questa",
  "non è possibile",
  "ci sto dentro troppo",
  "mi ha colpito",
  "troppo reale",
  "non me lo aspettavo",
  "😂😂😂",
  "mi triggera ma è vero",
  "non so se ridere o piangere",
  "questa è una verità scomoda",
  "ok ma è così",
  "non ci avevo pensato",
  "ci sta tutta",
  "è assurdo ma vero",
  "ok interessante",
  "ahahahah",
  "non è per tutti ma vero",
  "questo spiega tutto ahahahah",
  "ahahahahahahahah",
  "ok questo è deep",
  "troppo onesto",
  "questa è la realtà",
  "mi ha fatto riflettere",
  "non è male come idea",
  "mhh non saprei eh",
  "okok innegabile",
  "veramente giusto",
  "non è semplice ma vero",
  "questo è un fatto",
  "ok condivido",
  "non è opinabile",
  "ci sta come visione",
  "ok interessante punto",
  "veramente forte",
  "non è banale",
  "ci ho pensato anche io",
  "ma sei fuori",
  "non è lontano dalla realtà",
  "sei matto bro",
  "ok abbastanza vero",
  "non è assurdo",
  "ci sta",
  "ok lo capisco",
  "non è fuori luogo",
  "farò finta di non aver visto sta roba eh",
  "ok lo accetto",
  "ci sta perfettamente",
  "non è discutibile",
  "ok ci credo",
  "ci vuole coerenza nella vita",
  "non è inventato",
  "ritira SUBITO quello che hai detto",
  "anche io la vedo cosi bro",
  "non è strano",
  "ma che cazzo dici",
  "ok giusto punto",
  "ma che analisi è",
  "ok lo riconosco",
  "veramente sensato",
  "totalmente bollito",
  "MA SEI MATTO",
  "ok lo approvo",
  "non è esagerato",
  "stai fuori come non so cosa",
  "SEI UN SURGELATO",
  "ok lo confermo",
  "non è forzato",
  "ci può stare",
  "bro lascia perdere le opinioni",
  "ok lo rispetto",
  "logico",
  "ci sta come interpretazione",
  "si condivido"
];

const FAKE_AUTHORS = [
  "VectorVoid38","NeonPulse72","ShadowByte14","QuantumRush56",
  "PixelNova83","EchoBlaze29","CyberDrift91","NovaFlux47",
  "AlphaGlitch65","TurboVortex22","HyperNova39","ZenithByte58",
  "OmegaPulse74","DeltaPhantom11","CrimsonVector90","LunarShift36",
  "GhostMatrix81","AeroBlitz27","FusionSpark64","BinaryStorm52"
];

// ─── PARAMETRI ─────────────────────────────────────────────
const TOTAL_REACTIONS = 1000;
const BATCH_SIZE = 50;

const COMMENT_PROBABILITY = 0.2;
const COMMENT_REACTION_PROBABILITY = 0.7;

// ─── HELPERS ──────────────────────────────────────────────
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function randomInterval() {
  return 20000 + Math.floor(Math.random() * 40000);
}

function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── LIMITI COMMENTI ───────────────────────────────────────
function generateCommentLimits(posts) {
  const limits = {};

  posts.forEach((post) => {
    const r = Math.random();

    if (r < 0.7) limits[post.id] = 1;
    else if (r < 0.95) limits[post.id] = 2;
    else limits[post.id] = 3;
  });

  return limits;
}

// ─── FETCH ────────────────────────────────────────────────
async function getRecentPosts(limit = 100) {
  const { data } = await supabase
    .from("posts")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

async function getRecentComments(limit = 200) {
  const { data } = await supabase
    .from("comments")
    .select("id, post_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

// ─── REACTIONS POST ────────────────────────────────────────
async function insertReactionsBatch(posts) {
  const payload = [];

  for (let i = 0; i < BATCH_SIZE; i++) {
    const post = pickRandom(posts);

    payload.push({
      post_id: post.id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
    });
  }

  await supabase.from("reactions").insert(payload);
}

// ─── COMMENTS ──────────────────────────────────────────────
async function insertCommentsBatch(posts, size, commentLimits) {
  const payload = [];
  const commentCount = {};

  for (let i = 0; i < size; i++) {
    const post = pickRandom(posts);

    const current = commentCount[post.id] || 0;
    const limit = commentLimits[post.id] || 1;

    if (current >= limit) continue;

    payload.push({
      post_id: post.id,
      text: pickRandom(COMMENTS),
      author: pickRandom(FAKE_AUTHORS),
      language: "it",
      category: "Opinione",
      mood: "Bored",
    });

    commentCount[post.id] = current + 1;
  }

  if (payload.length) {
    await supabase.from("comments").insert(payload);
    console.log(`💬 +${payload.length} comments`);
  }
}

// ─── COMMENT REACTIONS (FIX DISTRIBUITO) ──────────────────
async function insertCommentReactionsDistributed(comments) {
  const count = Math.floor(Math.random() * 3) + 1; // 1–3 reaction

  const payload = [];

  for (let i = 0; i < count; i++) {
    const c = pickRandom(comments);

    payload.push({
      comment_id: c.id,
      post_id: c.post_id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
      reactor_name: pickRandom(FAKE_AUTHORS),
    });
  }

  await supabase.from("comment_reactions").insert(payload);
}

// ─── MAIN ENGINE ──────────────────────────────────────────
async function main() {
  console.log("🤖 BOT AVVIATO");

  const posts = await getRecentPosts();
  if (!posts.length) return;

  const comments = await getRecentComments();
  const commentLimits = generateCommentLimits(posts);

  let done = 0;

  while (done < TOTAL_REACTIONS) {
    await insertReactionsBatch(posts);
    done += BATCH_SIZE;

    if (Math.random() < COMMENT_PROBABILITY) {
      await insertCommentsBatch(
        posts,
        Math.floor(BATCH_SIZE / 2),
        commentLimits
      );
    }

    if (comments.length && Math.random() < COMMENT_REACTION_PROBABILITY) {
      await insertCommentReactionsDistributed(comments);
    }

    console.log(`⚡ Progress: ${done}/${TOTAL_REACTIONS}`);

  await sleep(randomInterval());

  console.log("✅ BOT FINITO");
}

main();
