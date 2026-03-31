const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── CONFIG ───────────────────────────────────────────────
const EMOJIS = ["❤️", "🔥", "😂", "💀", "😮"];

const COMMENTS = [
  // stile giovane veloce
  "palese",
  "clamoroso",
  "true af",
  "no cap",
  "assurdo",
  "this is so real",
  "lowkey d'accordo",
  "fr fr",
  "bro has a point",
  "non potevo dirlo meglio",
  "esatto però",
  "ceh",
  "too real",
  "finalmente qualcuno lo dice",
  "letteralmente io",
  "dipende ma tendenzialmente sì",
  "unpopular? per me è ovvio",
  "non fa una piega",
  "okay ma hai ragione",
  "questo mi rappresenta",
  "mi hai letto nel pensiero",
  "sempre stato convinto di questo",
  "chi non capisce questo non capisce niente",
  "era ora che qualcuno lo dicesse",
  "bomba questo",
  "periodT",
  "based",
  "W take",
  "hard agree",
  "sto piangendo perché è vero",
  "chi ha scritto questo mi conosce",
  "okay questo è valido",
  "non si può non essere d'accordo",
  "giusto ma anche no in certi casi",
  "dipende dal contesto però",
  "in realtà sì",
  "veramente clamoroso",
  "assurdo quanto sia vero",
  "mi fermo qui perché sennò scrivo un saggio",
  "qualcuno screenshot questo",
  "salvato",
  "mando questo ai miei amici",

  // stile medio
  "mi trovo d'accordo, purtroppo",
  "ogni volta che ci penso arrivo alla stessa conclusione",
  "non è un'opinione sono i fatti",
  "chi non lo vede non vuole vederlo",
  "cambiatemi l'idea",
  "ne parlavo proprio ieri",
  "esatto, non c'è altro da aggiungere",
  "veramente non ho parole per descriverlo",
  "detto anch'io mille volte",
  "finalmente qualcuno lo scrive",
  "questa è la risposta giusta",
  "ma poi ceh, è ovvio no",
  "concordo al 100%",
  "e chi non è d'accordo ha torto",
  "questa cosa mi fa impazzire da anni",
  "non potrei essere più d'accordo",
  "è esattamente così e basta",
  "il problema è che in pochi lo capiscono",
  "e invece nessuno lo dice mai abbastanza",
  "rispetto per chi scrive queste cose",

  // stile più serio
  "Condivido pienamente questa riflessione.",
  "È esattamente quello che penso da tempo.",
  "Finalmente un'opinione sensata su questo argomento.",
  "Non avrei saputo dirlo meglio.",
  "Questo è un punto che troppo spesso viene ignorato.",
  "Una prospettiva interessante e condivisibile.",
  "Sono completamente d'accordo con questa visione.",
  "Ci vuole coraggio a dirlo, ma è la verità.",
  "È raro trovare qualcuno che la pensi così chiaramente.",
  "Questa è esattamente la posizione corretta sulla questione.",
  "Un'osservazione acuta e puntuale.",
  "Non potrei essere più in disaccordo, ma rispetto l'opinione.",
  "Questa cosa andrebbe detta più spesso.",
  "Difficile non essere d'accordo con questa analisi.",
  "Un punto di vista che condivido profondamente.",
];

// ─── FAKE AUTHORS per i commenti ──────────────────────────
const FAKE_AUTHORS = [
  "marco_r91", "ele_thoughts", "giova_k", "silvia.mp", "fede_wild",
  "luca.exe", "vale_noir", "toma_says", "chiara_b", "andre_vibe",
  "mat_flow", "sara.irl", "davide_rc", "nico_takes", "giulia_x",
  "fra_mode", "alex_drop", "bianca_raw", "pietro_j", "anna_nf",
  "stefano_real", "laur_says", "simone_k", "marta_v", "enrico_g",
  "beatrice_irl", "riccardo_m", "serena_w", "filippo_t", "irene_drop",
];

// ─── HELPERS ──────────────────────────────────────────────
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── FETCH RECENT POSTS ───────────────────────────────────
async function getRecentPosts(limit = 50) {
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

// ─── FETCH RECENT COMMENTS ────────────────────────────────
async function getRecentComments(limit = 20) {
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

// ─── REACT TO A POST ──────────────────────────────────────
async function reactToPost(postId) {
  const reactor_id = randomUUID();
  const emoji = pickRandom(EMOJIS);

  const { error } = await supabase.from("reactions").insert({
    post_id: postId,
    emoji,
    reactor_id,
  });

  if (error) {
    console.error(`Errore reaction su post ${postId}:`, error.message);
  } else {
    console.log(`✅ Reaction ${emoji} su post ${postId}`);
  }
}

// ─── COMMENT ON A POST ────────────────────────────────────
async function commentOnPost(postId) {
  const author = pickRandom(FAKE_AUTHORS);
  const text = pickRandom(COMMENTS);

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    text,
    author,
    language: "it",
    category: "Opinione",
    mood: "Bored",
  });

  if (error) {
    console.error(`Errore commento su post ${postId}:`, error.message);
  } else {
    console.log(`💬 Commento su post ${postId}: "${text}" da ${author}`);
  }
}

// ─── REACT TO A COMMENT ───────────────────────────────────
async function reactToComment(commentId, postId) {
  const reactor_id = randomUUID();
  const reactor_name = pickRandom(FAKE_AUTHORS);
  const emoji = pickRandom(EMOJIS);

  const { error } = await supabase.from("comment_reactions").insert({
    comment_id: commentId,
    post_id: postId,
    emoji,
    reactor_id,
    reactor_name,
  });

  if (error) {
    console.error(`Errore reaction su commento ${commentId}:`, error.message);
  } else {
    console.log(`✅ Reaction ${emoji} su commento ${commentId}`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────
async function main() {
  console.log("🤖 Reactor bot avviato — obiettivo: 100 reazioni sui post...");

  const posts = await getRecentPosts(50);
  if (posts.length === 0) {
    console.log("Nessun post trovato.");
    return;
  }

  const TOTAL_REACTIONS = 100;
  let done = 0;

  for (let i = 0; i < TOTAL_REACTIONS; i++) {
    const post = pickRandom(posts);
    await reactToPost(post.id);
    done++;

    // Pausa ogni 10 reazioni per non martellare il DB
    if (done % 10 === 0) {
      console.log(`⏳ ${done}/${TOTAL_REACTIONS} reazioni completate...`);
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // 30% chance: reagisce anche a qualche commento recente
  if (Math.random() < 0.3) {
    const comments = await getRecentComments(10);
    if (comments.length > 0) {
      const comment = pickRandom(comments);
      await reactToComment(comment.id, comment.post_id);
    }
  }

  console.log(`✅ Bot completato — ${done} reazioni distribuite sui post.`);
}

main();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── CONFIG ───────────────────────────────────────────────
const EMOJIS = ["❤️", "🔥", "😂", "💀", "😮"];

const COMMENTS = [
  "palese", "clamoroso", "no cap", "fr fr", "true af",
  "assurdo davvero", "this is so real", "lowkey d'accordo",
  "bro has a point", "non potevo dirlo meglio", "too real onestamente",
  "finalmente qualcuno lo dice", "letteralmente io", "dipende ma ci sta",
  "based take", "W take", "questa è un hard agree", "questa è verità pura",
  "HAHAHAHA", "ok questo è pesante", "mi rappresenta troppo", "sto MALE",
  "non posso negarlo", "è proprio così", "facts", "FACTSSS",
  "ABSOLUTE CINEMA", "capisco benissimo", "è esattamente così",
  "AHAHAHAHAHAHA", "giusto così", "boh sì ci sta", "eh sì purtroppo",
  "mah sì", "okkk assurdo", "lol vero", "ok questo è troppo",
  "non ce la faccio", "verissimo", "no vabbè ma come ti è uscita questa",
  "non è possibile", "ci sto dentro troppo", "mi ha colpito",
  "troppo reale", "non me lo aspettavo", "😂😂😂",
  "mi triggera ma è vero", "non so se ridere o piangere",
  "questa è una verità scomoda", "ok ma è così", "non ci avevo pensato",
  "ci sta tutta", "è assurdo ma vero", "ok interessante", "ahahahah",
  "non è per tutti ma vero", "questo spiega tutto ahahahah",
  "ahahahahahahahah", "ok questo è deep", "troppo onesto",
  "questa è la realtà", "mi ha fatto riflettere", "non è male come idea",
  "mhh non saprei eh", "okok innegabile", "veramente giusto",
  "non è semplice ma vero", "questo è un fatto", "ok condivido",
  "non è opinabile", "ci sta come visione", "ok interessante punto",
  "veramente forte", "non è banale", "ci ho pensato anche io",
  "ma sei fuori", "non è lontano dalla realtà", "sei matto bro",
  "ok abbastanza vero", "non è assurdo", "ci sta", "ok lo capisco",
  "non è fuori luogo", "farò finta di non aver visto sta roba eh",
  "ok lo accetto", "ci sta perfettamente", "non è discutibile",
  "ok ci credo", "ci vuole coerenza nella vita", "non è inventato",
  "ritira SUBITO quello che hai detto", "anche io la vedo cosi bro",
  "non è strano", "ma che cazzo dici", "ok giusto punto",
  "ma che analisi è", "ok lo riconosco", "veramente sensato",
  "totalmente bollito", "MA SEI MATTO", "ok lo approvo",
  "non è esagerato", "stai fuori come non so cosa", "SEI UN SURGELATO",
  "ok lo confermo", "non è forzato", "ci può stare",
  "bro lascia perdere le opinioni", "ok lo rispetto", "logico",
  "ci sta come interpretazione", "si condivido"
];

const FAKE_AUTHORS = [
  "VectorVoid38", "NeonPulse72", "ShadowByte14", "QuantumRush56",
  "PixelNova83", "EchoBlaze29", "CyberDrift91", "NovaFlux47",
  "AlphaGlitch65", "TurboVortex22", "HyperNova39", "ZenithByte58",
  "OmegaPulse74", "DeltaPhantom11", "CrimsonVector90", "LunarShift36",
  "GhostMatrix81", "AeroBlitz27", "FusionSpark64", "BinaryStorm52"
];

// ─── PARAMS ────────────────────────────────────────────────
const TOTAL_REACTIONS = 1000;
const BATCH_SIZE = 50;

const COMMENT_PROBABILITY = 0.2;
const COMMENT_REACTION_PROBABILITY = 0.7;

const GLOBAL_COMMENT_COUNT = {};

// ─── HELPERS ──────────────────────────────────────────────
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── COMMENT LIMITS ────────────────────────────────────────
function generateCommentLimits(posts) {
  const limits = {};
  for (const post of posts) {
    const r = Math.random();
    limits[post.id] = r < 0.7 ? 1 : 2 + Math.floor(Math.random() * 2);
  }
  return limits;
}

// ─── SAFE INSERT WRAPPER ───────────────────────────────────
async function safeInsert(table, payload) {
  if (!payload.length) return;
  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    console.error(`❌ Insert error on ${table}:`, error.message);
  }
}

// ─── FETCH ────────────────────────────────────────────────
async function getRecentPosts(limit = 100) {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("❌ Error fetching posts:", error.message);
    return [];
  }
  return data || [];
}

async function getRecentComments(limit = 200) {
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("❌ Error fetching comments:", error.message);
    return [];
  }
  return data || [];
}

// ─── REACTIONS ────────────────────────────────────────────
async function insertReactionsBatch(posts) {
  const payload = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    const post = pickRandom(posts);
    if (!post) continue;
    payload.push({
      post_id: post.id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
    });
  }
  await safeInsert("reactions", payload);
}

// ─── COMMENTS ──────────────────────────────────────────────
async function insertCommentsBatch(posts, size, commentLimits) {
  const payload = [];
  for (let i = 0; i < size; i++) {
    const post = pickRandom(posts);
    if (!post) continue;
    const current = GLOBAL_COMMENT_COUNT[post.id] || 0;
    const limit = commentLimits[post.id] || 3;
    if (current >= limit) continue;
    payload.push({
      post_id: post.id,
      text: pickRandom(COMMENTS),
      author: pickRandom(FAKE_AUTHORS),
      language: "it",
      category: "Opinione",
      mood: "Bored",
    });
    GLOBAL_COMMENT_COUNT[post.id] = current + 1;
  }
  if (payload.length) {
    await safeInsert("comments", payload);
    console.log(`💬 +${payload.length} comments`);
  }
}

// ─── COMMENT REACTIONS ─────────────────────────────────────
async function insertCommentReactionsDistributed(comments) {
  if (!comments.length) return;
  const count = Math.floor(Math.random() * 3) + 1;
  const payload = [];
  for (let i = 0; i < count; i++) {
    const c = pickRandom(comments);
    if (!c) continue;
    payload.push({
      comment_id: c.id,
      post_id: c.post_id,
      emoji: pickRandom(EMOJIS),
      reactor_id: randomUUID(),
      reactor_name: pickRandom(FAKE_AUTHORS),
    });
  }
  await safeInsert("comment_reactions", payload);
}

// ─── MAIN ENGINE ──────────────────────────────────────────
async function main() {
  console.log("🤖 BOT AVVIATO");
  try {
    const posts = await getRecentPosts();
    if (!posts.length) {
      console.log("⚠️ No posts found");
      return;
    }
    const comments = await getRecentComments();
    const commentLimits = generateCommentLimits(posts);
    let done = 0;
    while (done < TOTAL_REACTIONS) {
      await insertReactionsBatch(posts);
      done += BATCH_SIZE;
      if (Math.random() < COMMENT_PROBABILITY) {
        await insertCommentsBatch(posts, Math.floor(BATCH_SIZE / 2), commentLimits);
      }
      if (comments.length && Math.random() < COMMENT_REACTION_PROBABILITY) {
        await insertCommentReactionsDistributed(comments);
      }
      console.log(`⚡ Progress: ${done}/${TOTAL_REACTIONS}`);
    }
    console.log("✅ BOT FINITO");
  } catch (err) {
    console.error("🔥 Fatal error:", err);
  }
}

main();
