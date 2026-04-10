const db = window.firebaseDb;
const {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  serverTimestamp
} = window.firebaseFns;

const squadData = {
  "CSK": ["Ruturaj Gaikwad","MS Dhoni","Sanju Samson","Dewald Brevis","Ayush Mhatre","Kartik Sharma","Sarfaraz Khan","Urvil Patel","Jamie Overton","Ramakrishna Ghosh","Prashant Veer","Matthew William Short","Aman Khan","Zak Foulkes","Shivam Dube","Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Mukesh Choudhary","Shreyas Gopal","Gurjapneet Singh","Akeal Hosein","Matt Henry","Rahul Chahar","Spencer Johnson"],
  "MI": ["Rohit Sharma","Surya Kumar Yadav","Robin Minz","Sherfane Rutherford","Ryan Rickelton","Quinton de Kock","Danish Malewar","N. Tilak Varma","Hardik Pandya","Naman Dhir","Mitchell Santner","Raj Angad Bawa","Atharva Ankolekar","Mayank Rawat","Corbin Bosch","Will Jacks","Shardul Thakur","Trent Boult","Mayank Markande","Deepak Chahar","Ashwani Kumar","Raghu Sharma","Mohammad Izhar","Allah Ghazanfar","Jasprit Bumrah"],
  "RCB": ["Rajat Patidar","Devdutt Padikkal","Virat Kohli","Phil Salt","Jitesh Sharma","Jordan Cox","Krunal Pandya","Swapnil Singh","Tim David","Romario Shepherd","Jacob Bethell","Venkatesh Iyer","Satvik Deswal","Mangesh Yadav","Vicky Ostwal","Vihaan Malhotra","Kanishk Chouhan","Josh Hazlewood","Rasikh Dar","Suyash Sharma","Bhuvneshwar Kumar","Nuwan Thushara","Abhinandan Singh","Jacob Duffy","Yash Dayal"],
  "KKR": ["Ajinkya Rahane","Rinku Singh","Angkrish Raghuvanshi","Manish Pandey","Finn Allen","Tejasvi Singh","Rahul Tripathi","Tim Seifert","Rovman Powell","Anukul Roy","Cameron Green","Sarthak Ranjan","Daksh Kamra","Rachin Ravindra","Ramandeep Singh","Sunil Narine","Blessing Muzarabani","Vaibhav Arora","Matheesha Pathirana","Kartik Tyagi","Prashant Solanki","Saurabh Dubey","Navdeep Saini","Umran Malik","Varun Chakaravarthy"],
  "RR": ["Shubham Dubey","Vaibhav Sooryavanshi","Donovan Ferreira","Lhuan-dre Pretorious","Ravi Singh","Aman Rao Perala","Shimron Hetmyer","Yashasvi Jaiswal","Dhruv Jurel","Riyan Parag","Yudhvir Singh Charak","Ravindra Jadeja","Dasun Shanaka","Jofra Archer","Tushar Deshpande","Kwena Maphaka","Ravi Bishnoi","Sushant Mishra","Yash Raj Punja","Vignesh Puthur","Brijesh Sharma","Adam Milne","Kuldeep Sen","Sandeep Sharma","Nandre Burger"],
  "SRH": ["Ishan Kishan","Aniket Verma","Smaran Ravichandran","Salil Arora","Heinrich Klaasen","Travis Head","Harshal Patel","Kamindu Mendis","Harsh Dubey","Brydon Carse","Shivang Kumar","Krains Fuletra","Liam Livingstone","David Payne","Abhishek Sharma","Nitish Kumar Reddy","Pat Cummins","Zeeshan Ansari","Jaydev Unadkat","Eshan Malinga","Sakib Hussain","Onkar Tarmale","Amit Kumar","Praful Hinge","Shivam Mavi"],
  "DC": ["KL Rahul","Karun Nair","David Miller","Ben Duckett","Pathum Nissanka","Sahil Parakh","Prithvi Shaw","Abishek Porel","Tristan Stubbs","Axar Patel","Sameer Rizvi","Ashutosh Sharma","Vipraj Nigam","Ajay Mandal","Tripurana Vijay","Madhav Tiwari","Nitish Rana","Mitchell Starc","T. Natarajan","Mukesh Kumar","Dushmantha Chameera","Auqib Nabi","Lungisani Ngidi","Kyle Jamieson","Kuldeep Yadav"],
  "GT": ["Shubman Gill","Jos Buttler","Kumar Kushagra","Anuj Rawat","Tom Banton","Glenn Phillips","Sai Sudharsan","Nishant Sindhu","Washington Sundar","Mohd. Arshad Khan","Sai Kishore","Jayant Yadav","Jason Holder","Rahul Tewatia","Shahrukh Khan","Kagiso Rabada","Mohammed Siraj","Prasidh Krishna","Manav Suthar","Gurnoor Singh Brar","Ishant Sharma","Ashok Sharma","Luke Wood","Kulwant Khejroliya","Rashid Khan"],
  "PBKS": ["Shreyas Iyer","Josh Inglis","Harnoor Pannu","Nehal Wadhera","Pyla Avinash","Vishnu Vinod","Prabhsimran Singh","Shashank Singh","Aaron Hardie","Marco Jansen","Marcus Stoinis","Priyansh Arya","Harpreet Brar","Azmatullah Omarzai","Suryansh Shedge","Musheer Khan","Mitch Owen","Kuldeep Sen","Xavier Bartlett","Yuzvendra Chahal","Vyshak Vijaykumar","Yash Thakur","Pravin Dubey","Arshdeep Singh","Kyle Jamieson"],
  "LSG": ["Rishabh Pant","Aiden Markram","Himmat Singh","Matthew Breetzke","Mukul Choudhary","Akshat Raghuwanshi","Josh Inglis","Nicholas Pooran","Mitchell Marsh","Abdul Samad","Shahbaz Ahamad","Arshin Kulkarni","Wanindu Hasaranga","Ayush Badoni","Mohammad Shami","Avesh Khan","M. Siddharth","Digvesh Singh","Akash Singh","Prince Yadav","Arjun Tendulkar","Anrich Nortje","Naman Tiwari","Mayank Yadav","Mohsin Khan"]
};

const matches = [
  { id: "m14", label: "DC vs GT", team1: "DC", team2: "GT", date: "08 Apr 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m15", label: "KKR vs LSG", team1: "KKR", team2: "LSG", date: "09 Apr 2026", venue: "Kolkata", time: "7:30 PM" },
  { id: "m16", label: "RR vs RCB", team1: "RR", team2: "RCB", date: "10 Apr 2026", venue: "Guwahati", time: "7:30 PM" },
  { id: "m17", label: "PBKS vs SRH", team1: "PBKS", team2: "SRH", date: "11 Apr 2026", venue: "New Chandigarh", time: "3:30 PM" },
  { id: "m18", label: "CSK vs DC", team1: "CSK", team2: "DC", date: "11 Apr 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m19", label: "LSG vs GT", team1: "LSG", team2: "GT", date: "12 Apr 2026", venue: "Lucknow", time: "3:30 PM" },
  { id: "m20", label: "MI vs RCB", team1: "MI", team2: "RCB", date: "12 Apr 2026", venue: "Mumbai", time: "7:30 PM" },
  { id: "m21", label: "SRH vs RR", team1: "SRH", team2: "RR", date: "13 Apr 2026", venue: "Hyderabad", time: "7:30 PM" },
  { id: "m22", label: "CSK vs KKR", team1: "CSK", team2: "KKR", date: "14 Apr 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m23", label: "RCB vs LSG", team1: "RCB", team2: "LSG", date: "15 Apr 2026", venue: "Bengaluru", time: "7:30 PM" },
  { id: "m24", label: "MI vs PBKS", team1: "MI", team2: "PBKS", date: "16 Apr 2026", venue: "Mumbai", time: "7:30 PM" },
  { id: "m25", label: "GT vs KKR", team1: "GT", team2: "KKR", date: "17 Apr 2026", venue: "Ahmedabad", time: "7:30 PM" },
  { id: "m26", label: "RCB vs DC", team1: "RCB", team2: "DC", date: "18 Apr 2026", venue: "Bengaluru", time: "3:30 PM" },
  { id: "m27", label: "SRH vs CSK", team1: "SRH", team2: "CSK", date: "18 Apr 2026", venue: "Hyderabad", time: "7:30 PM" },
  { id: "m28", label: "KKR vs RR", team1: "KKR", team2: "RR", date: "19 Apr 2026", venue: "Kolkata", time: "3:30 PM" },
  { id: "m29", label: "PBKS vs LSG", team1: "PBKS", team2: "LSG", date: "19 Apr 2026", venue: "New Chandigarh", time: "7:30 PM" },
  { id: "m30", label: "GT vs MI", team1: "GT", team2: "MI", date: "20 Apr 2026", venue: "Ahmedabad", time: "7:30 PM" },
  { id: "m31", label: "SRH vs DC", team1: "SRH", team2: "DC", date: "21 Apr 2026", venue: "Hyderabad", time: "7:30 PM" },
  { id: "m32", label: "LSG vs RR", team1: "LSG", team2: "RR", date: "22 Apr 2026", venue: "Lucknow", time: "7:30 PM" },
  { id: "m33", label: "MI vs CSK", team1: "MI", team2: "CSK", date: "23 Apr 2026", venue: "Mumbai", time: "7:30 PM" },
  { id: "m34", label: "RCB vs GT", team1: "RCB", team2: "GT", date: "24 Apr 2026", venue: "Bengaluru", time: "7:30 PM" },
  { id: "m35", label: "DC vs PBKS", team1: "DC", team2: "PBKS", date: "25 Apr 2026", venue: "Delhi", time: "3:30 PM" },
  { id: "m36", label: "RR vs SRH", team1: "RR", team2: "SRH", date: "25 Apr 2026", venue: "Jaipur", time: "7:30 PM" },
  { id: "m37", label: "GT vs CSK", team1: "GT", team2: "CSK", date: "26 Apr 2026", venue: "Ahmedabad", time: "3:30 PM" },
  { id: "m38", label: "LSG vs KKR", team1: "LSG", team2: "KKR", date: "26 Apr 2026", venue: "Lucknow", time: "7:30 PM" },
  { id: "m39", label: "DC vs RCB", team1: "DC", team2: "RCB", date: "27 Apr 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m40", label: "PBKS vs RR", team1: "PBKS", team2: "RR", date: "28 Apr 2026", venue: "New Chandigarh", time: "7:30 PM" },
  { id: "m41", label: "MI vs SRH", team1: "MI", team2: "SRH", date: "29 Apr 2026", venue: "Mumbai", time: "7:30 PM" },
  { id: "m42", label: "GT vs RCB", team1: "GT", team2: "RCB", date: "30 Apr 2026", venue: "Ahmedabad", time: "7:30 PM" },
  { id: "m43", label: "RR vs DC", team1: "RR", team2: "DC", date: "01 May 2026", venue: "Jaipur", time: "7:30 PM" },
  { id: "m44", label: "CSK vs MI", team1: "CSK", team2: "MI", date: "02 May 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m45", label: "SRH vs KKR", team1: "SRH", team2: "KKR", date: "03 May 2026", venue: "Hyderabad", time: "3:30 PM" },
  { id: "m46", label: "GT vs PBKS", team1: "GT", team2: "PBKS", date: "03 May 2026", venue: "Ahmedabad", time: "7:30 PM" },
  { id: "m47", label: "MI vs LSG", team1: "MI", team2: "LSG", date: "04 May 2026", venue: "Mumbai", time: "7:30 PM" },
  { id: "m48", label: "DC vs CSK", team1: "DC", team2: "CSK", date: "05 May 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m49", label: "SRH vs PBKS", team1: "SRH", team2: "PBKS", date: "06 May 2026", venue: "Hyderabad", time: "7:30 PM" },
  { id: "m50", label: "LSG vs RCB", team1: "LSG", team2: "RCB", date: "07 May 2026", venue: "Lucknow", time: "7:30 PM" },
  { id: "m51", label: "DC vs KKR", team1: "DC", team2: "KKR", date: "08 May 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m52", label: "RR vs GT", team1: "RR", team2: "GT", date: "09 May 2026", venue: "Jaipur", time: "7:30 PM" },
  { id: "m53", label: "CSK vs LSG", team1: "CSK", team2: "LSG", date: "10 May 2026", venue: "Chennai", time: "3:30 PM" },
  { id: "m54", label: "RCB vs MI", team1: "RCB", team2: "MI", date: "10 May 2026", venue: "Raipur", time: "7:30 PM" },
  { id: "m55", label: "PBKS vs DC", team1: "PBKS", team2: "DC", date: "11 May 2026", venue: "Dharamsala", time: "7:30 PM" },
  { id: "m56", label: "GT vs SRH", team1: "GT", team2: "SRH", date: "12 May 2026", venue: "Ahmedabad", time: "7:30 PM" },
  { id: "m57", label: "RCB vs KKR", team1: "RCB", team2: "KKR", date: "13 May 2026", venue: "Raipur", time: "7:30 PM" },
  { id: "m58", label: "PBKS vs MI", team1: "PBKS", team2: "MI", date: "14 May 2026", venue: "Dharamsala", time: "7:30 PM" },
  { id: "m59", label: "LSG vs CSK", team1: "LSG", team2: "CSK", date: "15 May 2026", venue: "Lucknow", time: "7:30 PM" },
  { id: "m60", label: "KKR vs GT", team1: "KKR", team2: "GT", date: "16 May 2026", venue: "Kolkata", time: "7:30 PM" },
  { id: "m61", label: "PBKS vs RCB", team1: "PBKS", team2: "RCB", date: "17 May 2026", venue: "Dharamsala", time: "3:30 PM" },
  { id: "m62", label: "DC vs RR", team1: "DC", team2: "RR", date: "17 May 2026", venue: "Delhi", time: "7:30 PM" },
  { id: "m63", label: "CSK vs SRH", team1: "CSK", team2: "SRH", date: "18 May 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m64", label: "RR vs LSG", team1: "RR", team2: "LSG", date: "19 May 2026", venue: "Jaipur", time: "7:30 PM" },
  { id: "m65", label: "KKR vs MI", team1: "KKR", team2: "MI", date: "20 May 2026", venue: "Kolkata", time: "7:30 PM" },
  { id: "m66", label: "CSK vs GT", team1: "CSK", team2: "GT", date: "21 May 2026", venue: "Chennai", time: "7:30 PM" },
  { id: "m67", label: "SRH vs RCB", team1: "SRH", team2: "RCB", date: "22 May 2026", venue: "Hyderabad", time: "7:30 PM" },
  { id: "m68", label: "LSG vs PBKS", team1: "LSG", team2: "PBKS", date: "23 May 2026", venue: "Lucknow", time: "7:30 PM" },
  { id: "m69", label: "MI vs RR", team1: "MI", team2: "RR", date: "24 May 2026", venue: "Mumbai", time: "3:30 PM" },
  { id: "m70", label: "KKR vs DC", team1: "KKR", team2: "DC", date: "24 May 2026", venue: "Kolkata", time: "7:30 PM" }
];

const friendNames = ["Karan", "Yash", "Abhimanyu", "Ishan", "Vishal"];

let activeTeamTab = Object.keys(squadData)[0];
let activeFriend = null;
let currentMatchId = null;
let selections = {};
let leaderboard = [];

function parseMatchDate(dateStr) {
  const [day, month, year] = dateStr.split(" ");
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  return new Date(Number(year), monthMap[month], Number(day));
}

function autoSelectTodayMatch() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const match of matches) {
    const matchDate = parseMatchDate(match.date);
    if (matchDate >= today) {
      currentMatchId = match.id;
      return;
    }
  }

  currentMatchId = matches[matches.length - 1].id;
}

function getCurrentMatch() {
  return matches.find((m) => m.id === currentMatchId) || matches[0];
}

function ensureFriendRecord(friendName) {
  if (!selections[friendName]) {
    selections[friendName] = {
      friendName,
      matchId: currentMatchId,
      players: [],
      captain: "",
      viceCaptain: "",
      updatedAt: null
    };
  }
}

function isMatchLocked(match) {
  const now = new Date();
  const [timePart, ampm] = match.time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const matchDate = parseMatchDate(match.date);
  matchDate.setHours(hours, minutes, 0, 0);

  return now >= matchDate;
}

function showToast(message) {
  let toast = document.getElementById("saveToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saveToast";
    toast.className = "save-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__saveToastTimer);
  window.__saveToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function seedFriends() {
  for (const name of friendNames) {
    const ref = doc(db, "friends", name);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        friendName: name,
        isActive: true,
        createdAt: serverTimestamp()
      });
    }
  }
}

function renderSchedule() {
  const grid = document.getElementById("scheduleGrid");
  const selector = document.getElementById("matchSelector");
  grid.innerHTML = "";
  selector.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  matches.forEach((match) => {
    const matchDate = parseMatchDate(match.date);
    const isToday = matchDate.getTime() === today.getTime();

    const card = document.createElement("div");
    card.className = `schedule-card ${match.id === currentMatchId ? "active-card" : ""} ${isToday ? "today-match" : ""}`;

    card.innerHTML = `
      <div class="schedule-head">
        <h3>${match.label}</h3>
        ${isToday ? `<span class="live-badge">TODAY</span>` : ``}
      </div>
      <p><strong>Date:</strong> ${match.date}</p>
      <p><strong>Time:</strong> ${match.time}</p>
      <p><strong>Venue:</strong> ${match.venue}</p>
      <button class="action-btn" data-match-id="${match.id}">Use This Match</button>
    `;
    grid.appendChild(card);

    const option = document.createElement("option");
    option.value = match.id;
    option.textContent = `${match.label} - ${match.date}`;
    if (match.id === currentMatchId) option.selected = true;
    selector.appendChild(option);
  });

  grid.querySelectorAll("button[data-match-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMatchId = btn.dataset.matchId;
      activeFriend = null;
      renderEverything();
    });
  });
}

function renderTeamTabs() {
  const tabs = document.getElementById("teamTabs");
  tabs.innerHTML = "";

  Object.keys(squadData).forEach((team) => {
    const btn = document.createElement("button");
    btn.className = `team-tab ${team === activeTeamTab ? "active" : ""}`;
    btn.textContent = team;

    btn.addEventListener("click", () => {
      activeTeamTab = team;
      renderTeamTabs();
      renderActiveTeamPlayers();
    });

    tabs.appendChild(btn);
  });
}

function renderActiveTeamPlayers() {
  document.getElementById("activeTeamTitle").textContent = `${activeTeamTab} Squad`;
  document.getElementById("teamPlayerGrid").innerHTML = squadData[activeTeamTab]
    .map((player) => `<div class="team-player-pill">${player}</div>`)
    .join("");
}

function renderCurrentMatchText() {
  const match = getCurrentMatch();
  document.getElementById("currentMatchText").textContent =
    `${match.label} | ${match.date} | ${match.time} | ${match.venue}`;
}

function renderActiveFriendText() {
  const el = document.getElementById("activeFriendText");

  if (!activeFriend) {
    el.textContent = "Click a friend card to start selecting players.";
    return;
  }

  ensureFriendRecord(activeFriend);
  el.textContent = `Selecting players for ${activeFriend} (${selections[activeFriend].players.length}/11 selected)`;
}

function buildPlayerButton(player) {
  const selected = activeFriend && selections[activeFriend]?.players.includes(player);
  const disabled = !activeFriend;
  return `<button class="pick-player-item ${selected ? "selected-player" : ""}" ${disabled ? "disabled" : ""} data-player="${player.replace(/"/g, "&quot;")}">${player}</button>`;
}

function renderMatchColumns() {
  const match = getCurrentMatch();

  document.getElementById("leftTeamTitle").textContent = match.team1;
  document.getElementById("rightTeamTitle").textContent = match.team2;

  document.getElementById("leftTeamPlayers").innerHTML =
    squadData[match.team1].map(buildPlayerButton).join("");
  document.getElementById("rightTeamPlayers").innerHTML =
    squadData[match.team2].map(buildPlayerButton).join("");

  document.querySelectorAll(".pick-player-item[data-player]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const currentMatch = getCurrentMatch();

      if (isMatchLocked(currentMatch)) {
        alert("Team selection is locked. This match has already started.");
        return;
      }

      if (!activeFriend) return;

      ensureFriendRecord(activeFriend);

      const player = btn.dataset.player;
      const record = selections[activeFriend];
      const exists = record.players.includes(player);

      if (exists) {
        record.players = record.players.filter((p) => p !== player);
        if (record.captain === player) record.captain = "";
        if (record.viceCaptain === player) record.viceCaptain = "";
      } else {
        if (record.players.length >= 11) {
          alert("You can select only 11 players.");
          return;
        }
        record.players.push(player);
      }

      await saveSelection(activeFriend);
      renderEverything();
    });
  });
}

function friendCardHtml(name) {
  ensureFriendRecord(name);
  const record = selections[name];
  const isActive = activeFriend === name;

  return `
    <div class="friend-card ${isActive ? "active-friend-card" : ""}">
      <div class="friend-card-top">
        <h3>${name}</h3>
        <button class="small-btn" data-select-friend="${name}">Select Players</button>
      </div>

      <label>Selected Players (${record.players.length}/11)</label>
      <div class="selected-player-list">
        ${
          record.players.length
            ? record.players.map((p) => `<span class="selected-pill">${p}</span>`).join("")
            : `<span class="empty-note">No players selected yet.</span>`
        }
      </div>

      <label>Captain</label>
      <select data-captain="${name}">
        <option value="">Select captain</option>
        ${record.players.map((p) => `<option value="${p}" ${record.captain === p ? "selected" : ""}>${p}</option>`).join("")}
      </select>

      <label>Vice-Captain</label>
      <select data-vice="${name}">
        <option value="">Select vice-captain</option>
        ${record.players.map((p) => `<option value="${p}" ${record.viceCaptain === p ? "selected" : ""}>${p}</option>`).join("")}
      </select>

      <div class="friend-actions">
        <button class="action-btn small-action" data-clear-friend="${name}">Clear Team</button>
      </div>

      <p><strong>Captain:</strong> ${record.captain || "-"}</p>
      <p><strong>Vice-Captain:</strong> ${record.viceCaptain || "-"}</p>
    </div>
  `;
}

function renderFriends() {
  const grid = document.getElementById("friendsGrid");
  grid.innerHTML = friendNames.map(friendCardHtml).join("");

  grid.querySelectorAll("[data-select-friend]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFriend = btn.dataset.selectFriend;
      ensureFriendRecord(activeFriend);
      renderEverything();
    });
  });

  grid.querySelectorAll("[data-captain]").forEach((select) => {
    select.addEventListener("change", async () => {
      const currentMatch = getCurrentMatch();

      if (isMatchLocked(currentMatch)) {
        alert("Match started. Team edits are locked.");
        renderEverything();
        return;
      }

      const name = select.dataset.captain;
      selections[name].captain = select.value;

      if (selections[name].viceCaptain === select.value) {
        selections[name].viceCaptain = "";
      }

      await saveSelection(name);
      renderEverything();
    });
  });

  grid.querySelectorAll("[data-vice]").forEach((select) => {
    select.addEventListener("change", async () => {
      const currentMatch = getCurrentMatch();

      if (isMatchLocked(currentMatch)) {
        alert("Match started. Team edits are locked.");
        renderEverything();
        return;
      }

      const name = select.dataset.vice;
      selections[name].viceCaptain = select.value;

      if (selections[name].captain === select.value) {
        selections[name].captain = "";
      }

      await saveSelection(name);
      renderEverything();
    });
  });

  grid.querySelectorAll("[data-clear-friend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const currentMatch = getCurrentMatch();

      if (isMatchLocked(currentMatch)) {
        alert("Match started. Team edits are locked.");
        return;
      }

      const name = btn.dataset.clearFriend;
      selections[name].players = [];
      selections[name].captain = "";
      selections[name].viceCaptain = "";

      await saveSelection(name);
      renderEverything();
    });
  });
}

async function saveSelection(friendName) {
  const record = selections[friendName];
  record.matchId = currentMatchId;
  record.updatedAt = serverTimestamp();

  await setDoc(doc(db, "selections", `${currentMatchId}_${friendName}`), record);
  showToast(`${friendName}'s team saved`);
}

function renderLeaderboard() {
  const body = document.getElementById("leaderboardBody");
  const rows = [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints);

  const medalForRank = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  body.innerHTML = rows.length
    ? rows.map((row, idx) => `
      <tr class="${idx < 3 ? "top-rank-row" : ""}">
        <td class="rank-cell">${medalForRank(idx)}</td>
        <td>${row.friendName}</td>
        <td>${row.totalPoints ?? 0}</td>
        <td>${row.captain || "-"}</td>
        <td>${row.viceCaptain || "-"}</td>
      </tr>
    `).join("")
    : friendNames.map((name, idx) => `
      <tr class="${idx < 3 ? "top-rank-row" : ""}">
        <td class="rank-cell">${medalForRank(idx)}</td>
        <td>${name}</td>
        <td>0</td>
        <td>-</td>
        <td>-</td>
      </tr>
    `).join("");
}

function listenSelections() {
  onSnapshot(collection(db, "selections"), (snapshot) => {
    selections = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.matchId === currentMatchId) {
        selections[data.friendName] = data;
      }
    });

    renderEverything(false);
  });
}

function listenLeaderboard() {
  onSnapshot(collection(db, "leaderboard"), (snapshot) => {
    leaderboard = [];
    snapshot.forEach((docSnap) => leaderboard.push(docSnap.data()));
    renderLeaderboard();
  });
}

function renderEverything(bindEvents = true) {
  if (!currentMatchId) {
    autoSelectTodayMatch();
  }

  renderSchedule();
  renderCurrentMatchText();
  renderTeamTabs();
  renderActiveTeamPlayers();
  renderActiveFriendText();
  renderMatchColumns();
  renderFriends();
  renderLeaderboard();

  if (bindEvents) {
    const loadBtn = document.getElementById("loadMatchBtn");
    if (loadBtn) {
      loadBtn.onclick = () => {
        currentMatchId = document.getElementById("matchSelector").value;
        activeFriend = null;
        renderEverything();
      };
    }
  }
}

(async function init() {
  await seedFriends();
  autoSelectTodayMatch();
  renderEverything();
  listenSelections();
  listenLeaderboard();
})();
