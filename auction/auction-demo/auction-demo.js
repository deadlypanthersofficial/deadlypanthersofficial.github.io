// auction-redesign.js

const players = [
  {
    name: "Vignesh Bhat",
    role: "⚔️ All-rounder | Koteshwar",
    base: 1000,
    bid: 18000,
    next: "Anirudh Kamath (Batsman)",
    img: "images/players/VIGNESH_BHAT.jpg"
  },
  {
    name: "Anirudh Kamath",
    role: "🏏 Batsman | Mangalore",
    base: 1000,
    bid: 7000,
    next: "Pavan Telang (Bowler)",
    img: "images/players/ANIRUDH.jpg"
  },
  {
    name: "Pavan Telang",
    role: "🎾 Bowler | Honnavar",
    base: 1000,
    bid: 9000,
    next: "Deepak Kamath (All-rounder)",
    img: "images/players/PAVAN_TELANG.jpg"
  },
  {
    name: "Deepak Kamath",
    role: "⚔️ All-rounder | Bola",
    base: 1000,
    bid: 14000,
    next: "Srinivas Pai BH (Batsman)",
    img: "images/players/DEEPAK_KAMATH_BOLA.jpg"
  },
  {
    name: "Srinivas Pai BH",
    role: "🏏 Batsman | Mangalore",
    base: 1000,
    bid: 12000,
    next: "Rohit B Kamath (Bowler)",
    img: "images/players/SRINIVAS_PAI_BH.jpg"
  },
  {
    name: "Rohit B Kamath",
    role: "🎾 Bowler | Alleppey",
    base: 1000,
    bid: 5000,
    next: "Adithya Sakardande (All-rounder)",
    img: "images/players/ROHIT_B_KAMATH.jpg"
  },
  {
    name: "Aditya Sakhardande",
    role: "⚔️ All-rounder | Mumbai",
    base: 1000,
    bid: 20000,
    // next: "—",
    img: "images/players/ADITYA_SAKHARDANDE.jpg"
  },
];

const teamPurse = {
  "GSB Kings": 50000,
  "Enjoy Titans": 50000,
  "V Strikers": 50000,
  "Gajakesari Sullia Battlers": 50000,
  "Veera Venkatesh Warriors": 50000,
  "Royal Challengers Bantwal": 50000,
  "Weekend Sports Club": 50000,
  "Veeranjaneya Cricketers Kaup": 50000,
  "Supreme Golden Garudas Gosripuram": 50000,
  "Kings Ullal": 50000,
  "Rising Stars Mangalore": 50000,
  "Silent Shores Mysuru Maharajas": 50000
};

const bidEl = document.getElementById("player-bid");
const timerEl = document.getElementById("bid-timer");
const logBox = document.getElementById("bid-log");
const soldSound = document.getElementById("sold-sound");
const soldBanner = document.getElementById("sold-banner");
const teamDisplay = document.getElementById("player-team");
const purseCards = document.querySelectorAll(".team-card");

let current = 0;
let timerInterval;
let lastWinningTeam = "";

function updatePlayerCard() {
  if (current === 0) resetTeamPurse();

  const p = players[current];
  document.getElementById("player-img").src = p.img;
  document.getElementById("player-name").innerText = p.name;
  document.getElementById("player-role").innerText = p.role;
  document.getElementById("player-base").innerText = `Base Price: ₹${p.base.toLocaleString()}`;
  document.getElementById("next-player").innerText = p.next ? `Next: ${p.next}` : "";
  document.getElementById("player-team").innerText = "";
  soldBanner.style.display = "none";
  logBox.innerHTML = "";

  startBidTimer(5, () => {
    animateBiddingTo(p.bid, (winner) => {
      lastWinningTeam = winner;
      document.getElementById("player-team").innerHTML = `✅ <strong>Sold To:</strong> ${winner}`;
      soldBanner.style.display = "block";
      soldBanner.classList.add("glow", "bounce"); // 💥 Add your animations
      soldSound.play();
      updateTeamPurse(winner, p.bid);
    });
  });

  current = (current + 1) % players.length;
}

function startBidTimer(duration, callback) {
  clearInterval(timerInterval);
  let time = duration;
  timerEl.innerText = `⏱️ ${time}s`;
  timerInterval = setInterval(() => {
    time--;
    timerEl.innerText = `⏱️ ${time}s`;
    if (time <= 0) {
      clearInterval(timerInterval);
      callback();
    }
  }, 1000);
}

function animateBiddingTo(finalAmount, callback) {
  let amount = 1000;
  bidEl.innerText = `₹1,000`;
  logBox.innerHTML = "";

  const fakeTeams = Object.keys(teamPurse).sort(() => 0.5 - Math.random());
  let fakeIndex = 0;
  let previousTeam = ""; // ✅ Track previous team
  let winningTeam = "";  // ✅ Track final winning team

  // Hide bidding team initially
  document.getElementById("player-team").innerText = "";

  const interval = setInterval(() => {
    if (amount < 10000) amount += 1000;
    else amount += 2000;

    // Choose a new team that is NOT the same as the previous one
    let fakeTeam = fakeTeams[fakeIndex];
    fakeIndex = (fakeIndex + 1) % fakeTeams.length;

    while (fakeTeam === previousTeam) {
      fakeTeam = fakeTeams[Math.floor(Math.random() * fakeTeams.length)];
    }

    previousTeam = fakeTeam;
    winningTeam = fakeTeam;

    // Update bid
    bidEl.innerText = `₹${amount.toLocaleString()}`;

    // Add log (on top)
    const log = document.createElement("p");
    log.innerText = `${fakeTeam} bid ₹${amount.toLocaleString()}`;
    logBox.insertBefore(log, logBox.firstChild);
    logBox.scrollTop = 0;

    // If we reached final amount
    if (amount >= finalAmount) {
      amount = finalAmount;
      clearInterval(interval);

      // Final update
      callback(winningTeam); // ✅ Sold To correct team
    }
  }, 500);
}

function updateTeamPurse(team, amount) {
  if (!teamPurse.hasOwnProperty(team)) return;
  teamPurse[team] -= amount;
  purseCards.forEach(card => {
    const name = card.querySelector("h3")?.innerText.trim();
    if (name === team) {
      const spentEl = card.querySelectorAll("p")[1];
      const remainingEl = card.querySelectorAll("p")[2];
      const total = 50000;
      const spent = total - teamPurse[team];
      spentEl.innerText = `Spent: ₹${spent.toLocaleString()}`;
      remainingEl.innerText = `Remaining: ₹${teamPurse[team].toLocaleString()}`;
    }
  });
}

function resetTeamPurse() {
  for (let team in teamPurse) {
    teamPurse[team] = 50000;
  }
  purseCards.forEach(card => {
    card.querySelectorAll("p")[1].innerText = `Spent: ₹0`;
    card.querySelectorAll("p")[2].innerText = `Remaining: ₹50,000`;
  });
  console.log("🔁 Team purse reset.");
}

window.onload = () => {
  updatePlayerCard();
  setInterval(updatePlayerCard, 15000);
};

// Switch Toggle
document.getElementById("home-toggle").addEventListener("click", () => {
  window.location.href = "/index.html";
});
document.getElementById("auction-toggle").addEventListener("click", () => {
  window.location.href = "/auction/auction.html";
});



