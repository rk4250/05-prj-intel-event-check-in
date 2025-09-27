// Grab DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// Team counters
const teamCounters = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"); 
};

// Attendance data
const max = 50;
let count = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendees = [];

// ---- Load Saved Progress from localStorage ----
window.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem("attendanceData"));
  if (savedData) {
    count = savedData.count;
    teamCounts = savedData.teamCounts;
    attendees = savedData.attendees;

    // Restore UI
    attendeeCountEl.textContent = count;
    for (let team in teamCounts) {
      teamCounters[team].textContent = teamCounts[team];
    }
    updateProgress();
    renderAttendeeList();
  }
});

// ---- Form Submit (Check-In) ----
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) return;

  // Increment totals
  count++;
  teamCounts[team]++;
  attendees.push({ name, team, teamName });

  // Update UI
  attendeeCountEl.textContent = count;
  teamCounters[team].textContent = teamCounts[team];
  updateProgress();
  renderAttendeeList();

  // Show personalized greeting
  greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  // Save to localStorage
  saveProgress();

  // Celebration if goal reached
  if (count === max) {
    celebrateWinner();
  }

  form.reset();
});

// ---- Progress Bar ----
function updateProgress() {
  const percentage = Math.min(Math.round((count / max) * 100), 100);
  progressBar.style.width = percentage + "%";
}

// ---- Save to localStorage ----
function saveProgress() {
  const data = {
    count,
    teamCounts,
    attendees,
  };
  localStorage.setItem("attendanceData", JSON.stringify(data));
}

// ---- Attendee List ----
function renderAttendeeList() {
  let listContainer = document.getElementById("attendeeList");
  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "attendeeList";
    listContainer.style.marginTop = "20px";
    document.querySelector(".team-stats").appendChild(listContainer);
  }

  listContainer.innerHTML = "<h4>Attendees</h4>";
  attendees.forEach((att) => {
    const item = document.createElement("p");
    item.textContent = `${att.name} — ${att.teamName}`;
    listContainer.appendChild(item);
  });
}

// ---- Celebration ----
function celebrateWinner() {
  // Find the winning team
  let winner = Object.keys(teamCounts).reduce((a, b) =>
    teamCounts[a] > teamCounts[b] ? a : b
  );
  const winnerName =
    winner === "water"
      ? "🌊 Team Water Wise"
      : winner === "zero"
      ? "🌿 Team Net Zero"
      : "⚡ Team Renewables";

  alert(`🎉 Attendance goal reached! Winning team: ${winnerName}`);
}

