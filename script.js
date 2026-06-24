/* =========================
   CONFIG
========================= */

const ADMIN_PASSWORD = "1234"; // <-- troque para uma senha real
const STORAGE_KEYS = {
  news: "gremio_news_v1",
  events: "gremio_events_v1",
  photos: "gremio_photos_v1",
  collabs: "gremio_collabs_v1",
  poll: "gremio_poll_v1",
  adminAuthed: "gremio_admin_authed_v1"
};

const POLL = {
  question: "Qual atividade você gostaria de ver no próximo mês?",
  options: [
    "Campeonato esportivo",
    "Noite cultural",
    "Gincana entre turmas",
    "Palestra e debate"
  ]
};

/* =========================
   DOM
========================= */

const yearEl = document.getElementById("year");
const lastUpdateBox = document.getElementById("lastUpdateBox");

const metricNoticias = document.getElementById("metricNoticias");
const metricEventos = document.getElementById("metricEventos");
const metricFotos = document.getElementById("metricFotos");

const newsList = document.getElementById("newsList");
const newsEmpty = document.getElementById("newsEmpty");

const eventsList = document.getElementById("eventsList");
const eventsEmpty = document.getElementById("eventsEmpty");

const photoGallery = document.getElementById("photoGallery");
const photosEmpty = document.getElementById("photosEmpty");

const pollQuestion = document.getElementById("pollQuestion");
const pollOptions = document.getElementById("pollOptions");
const pollResult = document.getElementById("pollResult");
const pollTotalVotes = document.getElementById("pollTotalVotes");
const pollAdminResult = document.getElementById("pollAdminResult");

const collabForm = document.getElementById("collabForm");
const collabMsg = document.getElementById("collabMsg");

const openAdminBtn = document.getElementById("openAdminBtn");
const adminBackdrop = document.getElementById("adminBackdrop");
const adminModal = document.getElementById("adminModal");
const closeAdminBtn = document.getElementById("closeAdminBtn");

const adminLoginPanel = document.getElementById("adminLoginPanel");
const adminPanel = document.getElementById("adminPanel");

const adminPass = document.getElementById("adminPass");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLoginMsg = document.getElementById("adminLoginMsg");
const adminResetBtn = document.getElementById("adminResetBtn");

/* Admin tabs */
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

/* Admin - forms & lists */
const newsAdminForm = document.getElementById("newsAdminForm");
const newsAdminMsg = document.getElementById("newsAdminMsg");
const newsAdminList = document.getElementById("newsAdminList");

const eventsAdminForm = document.getElementById("eventsAdminForm");
const eventsAdminMsg = document.getElementById("eventsAdminMsg");
const eventsAdminList = document.getElementById("eventsAdminList");

const photosAdminForm = document.getElementById("photosAdminForm");
const photosAdminMsg = document.getElementById("photosAdminMsg");
const photosAdminList = document.getElementById("photosAdminList");

const collabsAdminList = document.getElementById("collabsAdminList");

/* Admin: inputs */
const newsTitle = document.getElementById("newsTitle");
const newsDate = document.getElementById("newsDate");
const newsSummary = document.getElementById("newsSummary");

const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventPlace = document.getElementById("eventPlace");
const eventDesc = document.getElementById("eventDesc");

const photoTitle = document.getElementById("photoTitle");
const photoDate = document.getElementById("photoDate");
const photoFile = document.getElementById("photoFile");

/* =========================
   Helpers
========================= */

function todayISO() {
  const d = new Date();
  const tzOff = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - tzOff).toISOString().slice(0, 10);
  return localISO;
}

function formatDateBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateCard(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = {
    "01":"JAN","02":"FEV","03":"MAR","04":"ABR","05":"MAI","06":"JUN",
    "07":"JUL","08":"AGO","09":"SET","10":"OUT","11":"NOV","12":"DEZ"
  };
  return `${d} ${months[m] || m}`;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/* =========================
   Data initializers
========================= */

function ensureDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.news)) {
    writeStorage(STORAGE_KEYS.news, [
      {
        id: cryptoRandomId(),
        title: "Boas-vindas ao Portal do Grêmio",
        date: todayISO(),
        summary: "Aqui você encontra notícias, eventos, enquetes e fotos das ações do Grêmio Estudantil."
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.events)) {
    writeStorage(STORAGE_KEYS.events, [
      {
        id: cryptoRandomId(),
        title: "Reunião aberta do Grêmio",
        date: todayISO(),
        place: "Auditório / Sala Multiuso",
        desc: "Momento para ouvir sugestões dos estudantes e planejar as próximas ações."
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.photos)) {
    writeStorage(STORAGE_KEYS.photos, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.collabs)) {
    writeStorage(STORAGE_KEYS.collabs, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.poll)) {
    writeStorage(STORAGE_KEYS.poll, {
      question: POLL.question,
      options: POLL.options,
      votesByOption: Object.fromEntries(POLL.options.map(o => [o, 0])),
      voters: {} // usado para impedir múltiplos votos por tentativa (por id local)
    });
  }
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return "id_" + Math.random().toString(16).slice(2) + "_" + Date.now();
}

function ensurePollShape(poll) {
  if (!poll || !poll.options || !poll.votesByOption) return null;
  // Garante todas as opções
  for (const opt of POLL.options) {
    if (!(opt in poll.votesByOption)) poll.votesByOption[opt] = 0;
  }
  return poll;
}

/* =========================
   Rendering: Public
========================= */

function renderMetricsAndUpdateTime() {
  const news = readStorage(STORAGE_KEYS.news, []);
  const events = readStorage(STORAGE_KEYS.events, []);
  const photos = readStorage(STORAGE_KEYS.photos, []);

  metricNoticias.textContent = news.length;
  metricEventos.textContent = events.length;
  metricFotos.textContent = photos.length;

  const latestDates = [
    ...news.map(n => n.date),
    ...events.map(e => e.date),
    ...photos.map(p => p.date)
  ].filter(Boolean);

  if (latestDates.length === 0) {
    lastUpdateBox.textContent = "Ainda não há publicações no momento.";
    return;
  }

  const latest = latestDates.sort((a,b) => b.localeCompare(a))[0];
  lastUpdateBox.innerHTML = `Última atualização: <strong>${escapeHtml(formatDateBR(latest))}</strong>`;
}

function renderNews() {
  const news = readStorage(STORAGE_KEYS.news, []);
  const items = sortByDateDesc(news);

  newsList.innerHTML = "";
  if (items.length === 0) {
    newsEmpty.hidden = false;
    return;
  }
  newsEmpty.hidden = true;

  for (const n of items) {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <span class="news-date">${escapeHtml(formatDateCard(n.date))}</span>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.summary || "")}</p>
    `;
    newsList.appendChild(card);
  }
}

function renderEvents() {
  const events = readStorage(STORAGE_KEYS.events, []);
  const items = sortByDateDesc(events);

  eventsList.innerHTML = "";
  if (items.length === 0) {
    eventsEmpty.hidden = false;
    return;
  }
  eventsEmpty.hidden = true;

  for (const e of items) {
    const row = document.createElement("div");
    row.className = "timeline-item";
    row.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="event-card">
        <div class="event-date">${escapeHtml(formatDateBR(e.date))}${e.place ? " • " + escapeHtml(e.place) : ""}</div>
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.desc || "")}</p>
      </div>
    `;
    eventsList.appendChild(row);
  }
}

function renderGallery() {
  const photos = readStorage(STORAGE_KEYS.photos, []);
  const items = sortByDateDesc(photos);

  photoGallery.innerHTML = "";
  if (items.length === 0) {
    photosEmpty.hidden = false;
    return;
  }
  photosEmpty.hidden = true;

  for (const p of items) {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <div class="gallery-thumb">
        <img src="${escapeHtml(p.imageData || "")}" alt="${escapeHtml(p.title || "Foto do Grêmio")}" />
      </div>
      <div class="gallery-body">
        <div class="gallery-title">${escapeHtml(p.title || "")}</div>
        <div class="gallery-date">${escapeHtml(formatDateBR(p.date))}</div>
      </div>
    `;
    photoGallery.appendChild(div);
  }
}

function getLocalVoterId() {
  const key = "gremio_poll_voter_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = cryptoRandomId();
    localStorage.setItem(key, id);
  }
  return id;
}

function renderPoll() {
  const poll = ensurePollShape(readStorage(STORAGE_KEYS.poll, null)) || {
    question: POLL.question,
    options: POLL.options,
    votesByOption: Object.fromEntries(POLL.options.map(o => [o, 0])),
    voters: {}
  };

  pollQuestion.textContent = poll.question;
  pollOptions.innerHTML = "";
  pollResult.textContent = "";
  pollTotalVotes.textContent = `${Object.values(poll.votesByOption).reduce((a,b)=>a+b,0)} votos`;

  const voterId = getLocalVoterId();
  const alreadyVoted = poll.voters?.[voterId];

  for (const opt of poll.options) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "poll-option";
    if (alreadyVoted === opt) btn.classList.add("selected");
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      handleVote(opt);
    });

    pollOptions.appendChild(btn);
  }

  if (alreadyVoted) {
    pollResult.textContent = `Você votou em: ${alreadyVoted}.`;
    pollResult.style.color = "var(--accent)";
  } else {
    pollResult.textContent = `Escolha uma opção acima para votar.`;
    pollResult.style.color = "var(--muted)";
  }
}

function handleVote(option) {
  const poll = ensurePollShape(readStorage(STORAGE_KEYS.poll, null));
  if (!poll) return;

  const voterId = getLocalVoterId();
  if (poll.voters?.[voterId]) {
    pollResult.textContent = "Você já votou nesta enquete neste dispositivo.";
    pollResult.style.color = "#ffd27a";
    renderPoll();
    return;
  }

  if (!poll.votesByOption[option] && poll.votesByOption[option] !== 0) {
    return;
  }

  poll.votesByOption[option] += 1;
  poll.voters[voterId] = option;

  writeStorage(STORAGE_KEYS.poll, poll);
  renderPoll();
  renderPollAdmin();
}

/* =========================
   Public Collaboration form
========================= */

collabForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("cNome").value.trim();
  const turma = document.getElementById("cTurma").value.trim();
  const tipo = document.getElementById("cTipo").value;
  const msg = document.getElementById("cMsg").value.trim();

  if (!nome || !turma || !tipo || !msg) return;

  const collabs = readStorage(STORAGE_KEYS.collabs, []);
  collabs.unshift({
    id: cryptoRandomId(),
    nome,
    turma,
    tipo,
    msg,
    date: todayISO()
  });

  writeStorage(STORAGE_KEYS.collabs, collabs);

  collabMsg.textContent = "Obrigado! Sua colaboração foi enviada.";
  collabMsg.style.color = "var(--accent)";
  collabForm.reset();

  // Atualiza admin quando aberto
  renderCollabsAdmin();
});

/* =========================
   Rendering: Admin
========================= */

function adminAuthed() {
  return localStorage.getItem(STORAGE_KEYS.adminAuthed) === "1";
}

function setAdminAuthed(v) {
  localStorage.setItem(STORAGE_KEYS.adminAuthed, v ? "1" : "0");
}

function openAdminModal() {
  adminBackdrop.hidden = false;
  adminModal.hidden = false;

  if (adminAuthed()) {
    adminLoginPanel.hidden = true;
    adminPanel.hidden = false;
    syncAdminDefaultsInputs();
    renderAdminAll();
  } else {
    adminLoginPanel.hidden = false;
    adminPanel.hidden = true;
  }
}

function closeAdminModal() {
  adminBackdrop.hidden = true;
  adminModal.hidden = true;
}

function syncAdminDefaultsInputs() {
  const t = todayISO();
  if (newsDate) newsDate.value = t;
  if (eventDate) eventDate.value = t;
  if (photoDate) photoDate.value = t;
}

function renderAdminAll() {
  renderNewsAdminList();
  renderEventsAdminList();
  renderPhotosAdminList();
  renderCollabsAdmin();
  renderPollAdmin();
  renderMetricsAndUpdateTime();
}

function renderNewsAdminList() {
  const items = sortByDateDesc(readStorage(STORAGE_KEYS.news, []));
  newsAdminList.innerHTML = "";

  if (items.length === 0) {
    newsAdminList.innerHTML = `<div class="muted small">Nenhuma notícia.</div>`;
    return;
  }

  for (const n of items) {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <div class="admin-item-title">${escapeHtml(n.title)}</div>
      <div class="admin-item-sub">Data: ${escapeHtml(formatDateBR(n.date))}</div>
      <div class="admin-item-sub">${escapeHtml(n.summary || "")}</div>
      <div class="admin-actions">
        <button class="btn btn-outline" type="button" data-del-news="${escapeHtml(n.id)}">Remover</button>
      </div>
    `;
    div.querySelector(`[data-del-news="${n.id}"]`).addEventListener("click", () => {
      removeNews(n.id);
    });
    newsAdminList.appendChild(div);
  }
}

function removeNews(id) {
  const items = readStorage(STORAGE_KEYS.news, []).filter(x => x.id !== id);
  writeStorage(STORAGE_KEYS.news, items);
  renderAdminAll();
}

newsAdminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = newsTitle.value.trim();
  const date = newsDate.value;
  const summary = newsSummary.value.trim();

  if (!title || !date || !summary) return;

  const items = readStorage(STORAGE_KEYS.news, []);
  items.unshift({ id: cryptoRandomId(), title, date, summary });
  writeStorage(STORAGE_KEYS.news, items);

  newsAdminMsg.textContent = "Notícia adicionada com sucesso.";
  newsAdminMsg.style.color = "var(--accent)";

  newsAdminForm.reset();
  syncAdminDefaultsInputs();

  renderNewsAdminList();
  renderNews();
  renderMetricsAndUpdateTime();
});

function renderEventsAdminList() {
  const items = sortByDateDesc(readStorage(STORAGE_KEYS.events, []));
  eventsAdminList.innerHTML = "";

  if (items.length === 0) {
    eventsAdminList.innerHTML = `<div class="muted small">Nenhum evento.</div>`;
    return;
  }

  for (const ev of items) {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <div class="admin-item-title">${escapeHtml(ev.title)}</div>
      <div class="admin-item-sub">Data: ${escapeHtml(formatDateBR(ev.date))}${ev.place ? " • " + escapeHtml(ev.place) : ""}</div>
      <div class="admin-item-sub">${escapeHtml(ev.desc || "")}</div>
      <div class="admin-actions">
        <button class="btn btn-outline" type="button" data-del-event="${escapeHtml(ev.id)}">Remover</button>
      </div>
    `;
    div.querySelector(`[data-del-event="${ev.id}"]`).addEventListener("click", () => {
      removeEvent(ev.id);
    });
    eventsAdminList.appendChild(div);
  }
}

function removeEvent(id) {
  const items = readStorage(STORAGE_KEYS.events, []).filter(x => x.id !== id);
  writeStorage(STORAGE_KEYS.events, items);
  renderAdminAll();
}

eventsAdminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = eventTitle.value.trim();
  const date = eventDate.value;
  const place = eventPlace.value.trim();
  const desc = eventDesc.value.trim();

  if (!title || !date || !desc) return;

  const items = readStorage(STORAGE_KEYS.events, []);
  items.unshift({ id: cryptoRandomId(), title, date, place, desc });
  writeStorage(STORAGE_KEYS.events, items);

  eventsAdminMsg.textContent = "Evento adicionado com sucesso.";
  eventsAdminMsg.style.color = "var(--accent)";

  eventsAdminForm.reset();
  syncAdminDefaultsInputs();

  renderEventsAdminList();
  renderEvents();
  renderMetricsAndUpdateTime();
});

function renderPhotosAdminList() {
  const items = sortByDateDesc(readStorage(STORAGE_KEYS.photos, []));
  photosAdminList.innerHTML = "";

  if (items.length === 0) {
    photosAdminList.innerHTML = `<div class="muted small">Nenhuma foto.</div>`;
    return;
  }

  for (const p of items) {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center;">
        <img src="${escapeHtml(p.imageData || "")}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,255,255,0.10);" />
        <div>
          <div class="admin-item-title">${escapeHtml(p.title || "")}</div>
          <div class="admin-item-sub">Data: ${escapeHtml(formatDateBR(p.date))}</div>
        </div>
      </div>
      <div class="admin-actions">
        <button class="btn btn-outline admin-danger" type="button" data-del-photo="${escapeHtml(p.id)}">Remover</button>
      </div>
    `;
    div.querySelector(`[data-del-photo="${p.id}"]`).addEventListener("click", () => {
      removePhoto(p.id);
    });
    photosAdminList.appendChild(div);
  }
}

function removePhoto(id) {
  const items = readStorage(STORAGE_KEYS.photos, []).filter(x => x.id !== id);
  writeStorage(STORAGE_KEYS.photos, items);
  renderAdminAll();
}

photosAdminForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = photoTitle.value.trim();
  const date = photoDate.value;
  const file = photoFile.files?.[0];

  if (!title || !date || !file) return;

  try {
    photosAdminMsg.textContent = "Enviando imagem...";
    photosAdminMsg.style.color = "var(--muted)";

    const base64 = await fileToBase64(file);

    const items = readStorage(STORAGE_KEYS.photos, []);
    items.unshift({ id: cryptoRandomId(), title, date, imageData: base64 });
    writeStorage(STORAGE_KEYS.photos, items);

    photosAdminMsg.textContent = "Foto adicionada com sucesso.";
    photosAdminMsg.style.color = "var(--accent)";

    photosAdminForm.reset();
    syncAdminDefaultsInputs();

    renderPhotosAdminList();
    renderGallery();
    renderMetricsAndUpdateTime();
  } catch {
    photosAdminMsg.textContent = "Erro ao processar a imagem.";
    photosAdminMsg.style.color = "#ff9b9b";
  }
});

function renderCollabsAdmin() {
  const collabs = readStorage(STORAGE_KEYS.collabs, []);
  collabsAdminList.innerHTML = "";

  if (collabs.length === 0) {
    collabsAdminList.innerHTML = `<div class="muted small">Nenhuma colaboração registrada.</div>`;
    return;
  }

  for (const c of collabs.slice(0, 50)) {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <div class="admin-item-title">${escapeHtml(c.tipo)} • ${escapeHtml(c.nome)}</div>
      <div class="admin-item-sub">Turma: ${escapeHtml(c.turma)} • Data: ${escapeHtml(formatDateBR(c.date))}</div>
      <div class="admin-item-sub">${escapeHtml(c.msg)}</div>
    `;
    collabsAdminList.appendChild(div);
  }
}

function renderPollAdmin() {
  const poll = ensurePollShape(readStorage(STORAGE_KEYS.poll, null));
  if (!poll) return;

  const total = Object.values(poll.votesByOption).reduce((a,b)=>a+b,0);

  pollAdminResult.innerHTML = "";

  const rows = poll.options.map(opt => {
    const v = poll.votesByOption[opt] || 0;
    const pct = total > 0 ? Math.round((v / total) * 100) : 0;
    return { opt, v, pct };
  });

  for (const r of rows) {
    const wrapper = document.createElement("div");
    wrapper.className = "bar-row";
    wrapper.innerHTML = `
      <div class="admin-item-title">${escapeHtml(r.opt)}</div>
      <div class="bar"><div class="fill" style="width:${r.pct}%;"></div></div>
      <div class="pct">${r.v} (${r.pct}%)</div>
    `;
    pollAdminResult.appendChild(wrapper);
  }

  if (total === 0) {
    pollAdminResult.innerHTML = `<div class="muted small">Ainda não há votos.</div>`;
  }
}

/* =========================
   Admin modal controls
========================= */

openAdminBtn.addEventListener("click", () => openAdminModal());
closeAdminBtn.addEventListener("click", () => closeAdminModal());
adminBackdrop.addEventListener("click", () => closeAdminModal());

adminLoginBtn.addEventListener("click", () => {
  const pass = adminPass.value || "";
  if (pass === ADMIN_PASSWORD) {
    setAdminAuthed(true);
    adminLoginMsg.textContent = "Acesso liberado.";
    adminLoginMsg.style.color = "var(--accent)";

    adminLoginPanel.hidden = true;
    adminPanel.hidden = false;

    syncAdminDefaultsInputs();
    renderAdminAll();
    return;
  }
  adminLoginMsg.textContent = "Senha incorreta.";
  adminLoginMsg.style.color = "#ff9b9b";
});

adminResetBtn.addEventListener("click", () => {
  const ok = confirm("Tem certeza? Isso apagará dados locais do site (notícias, eventos, fotos, colaborações e votos).");
  if (!ok) return;

  Object.values(STORAGE_KEYS).forEach(k => {
    localStorage.removeItem(k);
  });

  setAdminAuthed(false);
  adminPass.value = "";
  adminLoginMsg.textContent = "Dados locais apagados. Recarregando...";
  adminLoginMsg.style.color = "var(--muted)";

  ensureDefaults();
  renderAllPublic();
  renderAllAdminIfOpen();
});

function renderAllPublic() {
  renderMetricsAndUpdateTime();
  renderNews();
  renderEvents();
  renderGallery();
  renderPoll();
}

function renderAllAdminIfOpen() {
  if (!adminModal.hidden && adminAuthed()) {
    renderAdminAll();
  }
}

/* Tabs */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    tabContents.forEach(tc => {
      tc.classList.toggle("active", tc.id === id);
    });
  });
});

/* =========================
   Initialize
========================= */

function renderPollOptionsSelectedState() {
  // opcional: já controlado pelo renderPoll()
}

function init() {
  ensureDefaults();

  yearEl.textContent = String(new Date().getFullYear());

  // set default dates on admin inputs
  const t = todayISO();
  if (newsDate) newsDate.value = t;
  if (eventDate) eventDate.value = t;
  if (photoDate) photoDate.value = t;

  // Public render
  renderAllPublic();

  // If admin already authed, keep panel synced
  if (adminAuthed()) {
    renderAllAdminIfOpen();
  }
}

function renderAllPublicSafe() {
  try { renderAllPublic(); } catch {}
}

init();

// Improve: when switching admin open, tabs default to news
function renderAdminAllPublicSync() {
  renderAdminAll();
}

// Minor: when opening admin after auth, ensure lists refreshed
// handled in openAdminModal()

// After vote, admin panel results should update if open
const observerInterval = setInterval(() => {
  if (!adminModal.hidden && adminAuthed()) {
    // atualiza apenas resultados da enquete com baixo custo
    renderPollAdmin();
  }
}, 2000);

// =========================
// Mobile nav toggle
// =========================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha menu ao clicar em um link
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
