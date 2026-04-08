const db = window.firebaseDb;
const { doc, getDoc, getDocs, setDoc, collection, serverTimestamp } = window.firebaseFns;

const ADMIN_PASSWORD = "karan-admin-2026";
let unlocked = false;

const matches = [
  { id: "m14", label: "DC vs GT", team1: "DC", team2: "GT", date: "08 Apr 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m15", label: "KKR vs LSG", team1: "KKR", team2: "LSG", date: "09 Apr 2026", venue: "Kolkata", time: "7:30 PM" },
  { id: "m16", label: "RR vs RCB", team1: "RR", team2: "RCB", date: "10 Apr 2026", venue: "Guwahati", time: "7:30 PM" },
  { id: "m17", label: "PBKS vs SRH", team1: "PBKS", team2: "SRH", date: "11 Apr 2026", venue: "New Chandigarh", time: "3:30 PM" },
  { id: "m18", label: "CSK vs DC", team1: "CSK", team2: "DC", date: "11 Apr 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m19", label: "LSG vs GT", team1: "LSG", team2: "GT", date: "12 Apr 2026", venue: "Lucknow", time: "3:30 PM" },
  { id: "m20", label: "MI vs RCB", team1: "MI", team2: "RCB", date: "12 Apr 2026", venue: "Mumbai", time: "7:30 PM" }
];

const squads = {
  "DC": ["KL Rahul","Karun Nair","David Miller","Ben Duckett","Pathum Nissanka","Sahil Parakh","Prithvi Shaw","Abishek Porel","Tristan Stubbs","Axar Patel","Sameer Rizvi","Ashutosh Sharma","Vipraj Nigam","Ajay Mandal","Tripurana Vijay","Madhav Tiwari","Nitish Rana","Mitchell Starc","T. Natarajan","Mukesh Kumar","Dushmantha Chameera","Auqib Nabi","Lungisani Ngidi","Kyle Jamieson","Kuldeep Yadav"],
  "GT": ["Shubman Gill","Jos Buttler","Kumar Kushagra","Anuj Rawat","Tom Banton","Glenn Phillips","Sai Sudharsan","Nishant Sindhu","Washington Sundar","Mohd. Arshad Khan","Sai Kishore","Jayant Yadav","Jason Holder","Rahul Tewatia","Shahrukh Khan","Kagiso Rabada","Mohammed Siraj","Prasidh Krishna","Manav Suthar","Gurnoor Singh Brar","Ishant Sharma","Ashok Sharma","Luke Wood","Kulwant Khejroliya","Rashid Khan"],
  "KKR": ["Ajinkya Rahane","Rinku Singh","Angkrish Raghuvanshi","Manish Pandey","Finn Allen","Tejasvi Singh","Rahul Tripathi","Tim Seifert","Rovman Powell","Anukul Roy","Cameron Green","Sarthak Ranjan","Daksh Kamra","Rachin Ravindra","Ramandeep Singh","Sunil Narine","Blessing Muzarabani","Vaibhav Arora","Matheesha Pathirana","Kartik Tyagi","Prashant Solanki","Saurabh Dubey","Navdeep Saini","Umran Malik","Varun Chakaravarthy"],
  "LSG": ["Rishabh Pant","Aiden Markram","Himmat Singh","Matthew Breetzke","Mukul Choudhary","Akshat Raghuwanshi","Josh Inglis","Nicholas Pooran","Mitchell Marsh","Abdul Samad","Shahbaz Ahamad","Arshin Kulkarni","Wanindu Hasaranga","Ayush Badoni","Mohammad Shami","Avesh Khan","M. Siddharth","Digvesh Singh","Akash Singh","Prince Yadav","Arjun Tendulkar","Anrich Nortje","Naman Tiwari","Mayank Yadav","Mohsin Khan"],
  "RR": ["Shubham Dubey","Vaibhav Sooryavanshi","Donovan Ferreira","Lhuan-dre Pretorious","Ravi Singh","Aman Rao Perala","Shimron Hetmyer","Yashasvi Jaiswal","Dhruv Jurel","Riyan Parag","Yudhvir Singh Charak","Ravindra Jadeja","Dasun Shanaka","Jofra Archer","Tushar Deshpande","Kwena Maphaka","Ravi Bishnoi","Sushant Mishra","Yash Raj Punja","Vignesh Puthur","Brijesh Sharma","Adam Milne","Kuldeep Sen","Sandeep Sharma","Nandre Burger"],
  "RCB": ["Rajat Patidar","Devdutt Padikkal","Virat Kohli","Phil Salt","Jitesh Sharma","Jordan Cox","Krunal Pandya","Swapnil Singh","Tim David","Romario Shepherd","Jacob Bethell","Venkatesh Iyer","Satvik Deswal","Mangesh Yadav","Vicky Ostwal","Vihaan Malhotra","Kanishk Chouhan","Josh Hazlewood","Rasikh Dar","Suyash Sharma","Bhuvneshwar Kumar","Nuwan Thushara","Abhinandan Singh","Jacob Duffy","Yash Dayal"],
  "PBKS": ["Shreyas Iyer","Josh Inglis","Harnoor Pannu","Nehal Wadhera","Pyla Avinash","Vishnu Vinod","Prabhsimran Singh","Shashank Singh","Aaron Hardie","Marco Jansen","Marcus Stoinis","Priyansh Arya","Harpreet Brar","Azmatullah Omarzai","Suryansh Shedge","Musheer Khan","Mitch Owen","Kuldeep Sen","Xavier Bartlett","Yuzvendra Chahal","Vyshak Vijaykumar","Yash Thakur","Pravin Dubey","Arshdeep Singh","Kyle Jamieson"],
  "SRH": ["Ishan Kishan","Aniket Verma","Smaran Ravichandran","Salil Arora","Heinrich Klaasen","Travis Head","Harshal Patel","Kamindu Mendis","Harsh Dubey","Brydon Carse","Shivang Kumar","Krains Fuletra","Liam Livingstone","David Payne","Abhishek Sharma","Nitish Kumar Reddy","Pat Cummins","Zeeshan Ansari","Jaydev Unadkat","Eshan Malinga","Sakib Hussain","Onkar Tarmale","Amit Kumar","Praful Hinge","Shivam Mavi"],
  "CSK": ["Ruturaj Gaikwad","MS Dhoni","Sanju Samson","Dewald Brevis","Ayush Mhatre","Kartik Sharma","Sarfaraz Khan","Urvil Patel","Jamie Overton","Ramakrishna Ghosh","Prashant Veer","Matthew William Short","Aman Khan","Zak Foulkes","Shivam Dube","Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Mukesh Choudhary","Shreyas Gopal","Gurjapneet Singh","Akeal Hosein","Matt Henry","Rahul Chahar","Spencer Johnson"],
  "MI": ["Rohit Sharma","Surya Kumar Yadav","Robin Minz","Sherfane Rutherford","Ryan Rickelton","Quinton de Kock","Danish Malewar","N. Tilak Varma","Hardik Pandya","Naman Dhir","Mitchell Santner","Raj Angad Bawa","Atharva Ankolekar","Mayank Rawat","Corbin Bosch","Will Jacks","Shardul Thakur","Trent Boult","Mayank Markande","Deepak Chahar","Ashwani Kumar","Raghu Sharma","Mohammad Izhar","Allah Ghazanfar","Jasprit Bumrah"]
};

let currentMatchId = matches[0].id;
let playerPoints = {};

function getCurrentMatch() {
  return matches.find(m => m.id === currentMatchId) || matches[0];
}

function loadMatches() {
  const selector = document.getElementById("adminMatchSelector");
  selector.innerHTML = matches.map(m => `<option value="${m.id}">${m.label} - ${m.date}</option>`).join("");
}

function renderCurrentMatchText() {
  const m = getCurrentMatch();
  document.getElementById("adminCurrentMatchText").textContent = `${m.label} | ${m.date} | ${m.time} | ${m.venue}`;
}

function renderPointsInputs() {
  const match = getCurrentMatch();
  const players = [...squads[match.team1], ...squads[match.team2]];
  const grid = document.getElementById("adminPointsGrid");
  grid.innerHTML = players.map(player => `
    <div class="admin-point-card">
      <label>${player}</label>
      <input type="number" data-player-point="${player}" value="${playerPoints[player] ?? 0}" placeholder="0" />
    </div>
  `).join("");
}

async function loadSavedPlayerPoints() {
  const snap = await getDoc(doc(db, "playerPoints", currentMatchId));
  playerPoints = snap.exists() ? (snap.data().points || {}) : {};
  renderPointsInputs();
}

async function savePlayerPoints() {
  if (!unlocked) return alert("Unlock admin first.");
  const inputs = document.querySelectorAll("[data-player-point]");
  const points = {};
  inputs.forEach(input => {
    points[input.dataset.playerPoint] = Number(input.value || 0);
  });
  playerPoints = points;
  await setDoc(doc(db, "playerPoints", currentMatchId), {
    matchId: currentMatchId,
    points,
    updatedAt: serverTimestamp()
  });
  alert("Player points saved.");
}

function calculateTeamPoints(selection, pointsMap) {
  let total = 0;
  for (const player of selection.players || []) {
    let playerScore = Number(pointsMap[player] || 0);
    if (selection.captain === player) {
      playerScore *= 2;
    } else if (selection.viceCaptain === player) {
      playerScore *= 1.5;
    }
    total += playerScore;
  }
  return total;
}

async function calculateResults() {
  if (!unlocked) return alert("Unlock admin first.");

  const playerPointSnap = await getDoc(doc(db, "playerPoints", currentMatchId));
  const pointsMap = playerPointSnap.exists() ? (playerPointSnap.data().points || {}) : {};
  const selectionSnap = await getDocs(collection(db, "selections"));

  const results = [];
  selectionSnap.forEach(docSnap => {
    const sel = docSnap.data();
    if (sel.matchId !== currentMatchId) return;

    const matchPoints = calculateTeamPoints(sel, pointsMap);
    results.push({ ...sel, matchPoints });
  });

  document.getElementById("adminResultsBody").innerHTML = results.map(r => `
    <tr>
      <td>${r.friendName}</td>
      <td>${(r.players || []).length}</td>
      <td>${r.captain || "-"}</td>
      <td>${r.viceCaptain || "-"}</td>
      <td>${r.matchPoints}</td>
    </tr>
  `).join("");

  for (const result of results) {
    const existingLeader = await getDoc(doc(db, "leaderboard", result.friendName));
    const existingTotal = existingLeader.exists() ? Number(existingLeader.data().totalPoints || 0) : 0;

    await setDoc(doc(db, "leaderboard", result.friendName), {
      friendName: result.friendName,
      totalPoints: existingTotal + result.matchPoints,
      captain: result.captain || "",
      viceCaptain: result.viceCaptain || "",
      updatedAt: serverTimestamp()
    });

    await setDoc(doc(db, "matchResults", `${currentMatchId}_${result.friendName}`), {
      matchId: currentMatchId,
      matchLabel: getCurrentMatch().label,
      friendName: result.friendName,
      points: result.matchPoints,
      createdAt: serverTimestamp()
    });
  }

  alert("Match results calculated and leaderboard updated.");
}

function unlockAdmin() {
  const value = document.getElementById("adminPassword").value;
  unlocked = value === ADMIN_PASSWORD;
  document.getElementById("adminStatus").textContent = unlocked ? "Unlocked" : "Locked";
  if (!unlocked) alert("Wrong password.");
}

document.getElementById("unlockAdminBtn").addEventListener("click", unlockAdmin);
document.getElementById("loadAdminMatchBtn").addEventListener("click", async () => {
  currentMatchId = document.getElementById("adminMatchSelector").value;
  renderCurrentMatchText();
  await loadSavedPlayerPoints();
});
document.getElementById("savePlayerPointsBtn").addEventListener("click", savePlayerPoints);
document.getElementById("calculateResultsBtn").addEventListener("click", calculateResults);

(async function init() {
  loadMatches();
  renderCurrentMatchText();
  await loadSavedPlayerPoints();
})();
