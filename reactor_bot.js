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
async function getRecentPosts(limit = 20) {
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
  console.log("🤖 Reactor bot avviato...");

  const posts = await getRecentPosts(20);
  if (posts.length === 0) {
    console.log("Nessun post trovato.");
    return;
  }

  // Scegli 1-3 post casuali su cui agire
  const numActions = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numActions; i++) {
    const post = pickRandom(posts);
    const action = Math.random();

    if (action < 0.5) {
      // 50% chance: react al post
      await reactToPost(post.id);
    } else {
      // 50% chance: commenta il post
      await commentOnPost(post.id);
    }

    // piccola pausa tra azioni
    await new Promise((r) => setTimeout(r, 500));
  }

  // 30% chance: reagisce anche a un commento recente
  if (Math.random() < 0.3) {
    const comments = await getRecentComments(10);
    if (comments.length > 0) {
      const comment = pickRandom(comments);
      await reactToComment(comment.id, comment.post_id);
    }
  }

  console.log("✅ Bot completato.");
}

main();
