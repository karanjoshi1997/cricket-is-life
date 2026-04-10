const db = window.firebaseDb;
const { doc, getDoc, getDocs, setDoc, collection, serverTimestamp } = window.firebaseFns;

const ADMIN_PASSWORD = "karan-admin-2026";

// 🔐 extra protection (page lock)
const entered = prompt("Enter Admin Password");
if (entered !== ADMIN_PASSWORD) {
  document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:50px;'>Access Denied</h1>";
  throw new Error("Unauthorized");
}

let currentMatchId = null;
let playerPoints = {};

const matches = [
  { id: "m14", label: "DC vs GT", team1: "DC", team2: "GT", date: "08 Apr 2026", time: "7:30 PM" },
  { id: "m15", label: "KKR vs LSG", team1: "KKR", team2: "LSG", date: "09 Apr 2026", time: "7:30 PM" },
  { id: "m16", label: "RR vs RCB", team1: "RR", team2: "RCB", date: "10 Apr 2026", time: "7:30 PM" },
  { id: "m17", label: "PBKS vs SRH", team1: "PBKS", team2: "SRH", date: "11 Apr 2026", time: "3:30 PM" },
  { id: "m18", label: "CSK vs DC", team1: "CSK", team2: "DC", date: "11 Apr 2026", time: "7:30 PM" }
];

const squads = window.squadData || {};

function getCurrentMatch() {
  return matches.find(m => m.id === currentMatchId) || matches[0];
}

function loadMatches() {
  const selector = document.getElementById("adminMatchSelector");
  selector.innerHTML = matches.map(m =>
    `<option value="${m.id}">${m.label} - ${m.date}</option>`
  ).join("");

  currentMatchId = matches[0].id;
}

function renderMatchText() {
  const m = getCurrentMatch();
  document.getElementById("adminCurrentMatchText").textContent =
    `${m.label} | ${m.date} | ${m.time}`;
}

function renderInputs() {
  const match = getCurrentMatch();
  const players = [...(window.squadData[match.team1] || []), ...(window.squadData[match.team2] || [])];

  const grid = document.getElementById("adminPointsGrid");

  grid.innerHTML = players.map(p => `
    <div class="admin-point-card">
      <label>${p}</label>
      <input type="number" data-player="${p}" value="${playerPoints[p] || 0}" />
    </div>
  `).join("");
}

async function loadPoints() {
  const snap = await getDoc(doc(db, "playerPoints", currentMatchId));
  playerPoints = snap.exists() ? snap.data().points : {};
  renderInputs();
}

async function savePoints() {
  const inputs = document.querySelectorAll("[data-player]");
  const data = {};

  inputs.forEach(i => {
    data[i.dataset.player] = Number(i.value || 0);
  });

  playerPoints = data;

  await setDoc(doc(db, "playerPoints", currentMatchId), {
    points: data,
    updatedAt: serverTimestamp()
  });

  alert("Points saved");
}

function calcTeam(selection, points) {
  let total = 0;

  for (let p of selection.players || []) {
    let pts = points[p] || 0;

    if (selection.captain === p) pts *= 2;
    else if (selection.viceCaptain === p) pts *= 1.5;

    total += pts;
  }

  return total;
}

async function calculate() {
  const pointsSnap = await getDoc(doc(db, "playerPoints", currentMatchId));
  const points = pointsSnap.exists() ? pointsSnap.data().points : {};

  const selectionsSnap = await getDocs(collection(db, "selections"));
  const results = [];

  selectionsSnap.forEach(docSnap => {
    const sel = docSnap.data();

    if (sel.matchId !== currentMatchId) return;

    const total = calcTeam(sel, points);

    results.push({
      ...sel,
      matchPoints: total
    });
  });

  document.getElementById("adminResultsBody").innerHTML =
    results.map(r => `
      <tr>
        <td>${r.friendName}</td>
        <td>${r.matchPoints}</td>
      </tr>
    `).join("");

  for (let r of results) {
    const ref = doc(db, "leaderboard", r.friendName);
    const existing = await getDoc(ref);

    const old = existing.exists() ? existing.data().totalPoints : 0;

    await setDoc(ref, {
      friendName: r.friendName,
      totalPoints: old + r.matchPoints
    });
  }

  alert("Leaderboard updated");
}

// events
document.getElementById("loadAdminMatchBtn").onclick = async () => {
  currentMatchId = document.getElementById("adminMatchSelector").value;
  renderMatchText();
  await loadPoints();
};

document.getElementById("savePlayerPointsBtn").onclick = savePoints;
document.getElementById("calculateResultsBtn").onclick = calculate;

// init
(async function () {
  loadMatches();
  renderMatchText();
  await loadPoints();
})();
