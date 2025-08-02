// Part 1: Setup, Colors, and Drawing the Wheel
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const dropdown = document.getElementById("teamDropdown");
const undoButton = document.getElementById("undoButton");
const exportButton = document.getElementById("exportButton");
const stopSound = document.getElementById("stopSound");
const progress = document.getElementById("progress");

const radius = canvas.width / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const totalSlices = 12;
let anglePerSlice = (2 * Math.PI) / totalSlices;
let rotation = 0;
let isSpinning = false;
let spinVelocity = 0;
let selectedSlice = null;
let teamSelections = [];
let history = [];

const jerseyColors = [
  "#091F43", "#FF1D1D", "#49A8E1", "#FF7C00", "#FDF93E", "#A6F3FB",
  "#000000", "#13386C", "#E83F6F", "#FDA901", "#F9B2E2", "#7B1FA2"
];

// === Drawing the Wheel ===
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < totalSlices; i++) {
    const startAngle = rotation + i * anglePerSlice;
    const endAngle = startAngle + anglePerSlice;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = jerseyColors[i];
    ctx.fill();

    ctx.fillStyle = jerseyColors[i];
    ctx.fill();

    if (teamSelections[i]) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerSlice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";

    const label = teamSelections[i] ? wrapText(teamSelections[i]) : (i + 1).toString();
    if (Array.isArray(label)) {
  for (let j = 0; j < label.length; j++) {
    ctx.fillText(label[j], radius - 10, 10 + j * 18);
  }
} else {
  ctx.fillText(label, radius - 10, 10);
}
    ctx.restore();
  }
}
function wrapText(text) {
  const words = text.split(' ');
  const maxLineLength = 10;
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    if ((currentLine + word).length > maxLineLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  lines.push(currentLine.trim());
  return lines;
}


// Part 2: Spin & Stop mechanics

// === Animation Loop ===
function animate() {
  if (isSpinning) {
    rotation += spinVelocity;
    spinVelocity *= 0.99;

    if (spinVelocity < 0.002) {
      isSpinning = false;
      try {
        finalizeSelection();
        stopSound.play();
        spinButton.disabled = false;
        dropdown.disabled = false;
      } catch (err) {
        console.error("Finalize failed:", err);
        spinButton.disabled = false;
        dropdown.disabled = false;
      }
    }
  }

  drawWheel();
  requestAnimationFrame(animate);
}

// === Spin Button Click ===
let spinCooldown = false;

spinButton.addEventListener("click", () => {
  if (isSpinning || spinCooldown || teamSelections.length >= totalSlices) return;

  // Begin spin
  dropdown.disabled = true;
  spinButton.disabled = true;
  spinCooldown = true;

  spinVelocity = Math.random() * 0.2 + 0.3;
  isSpinning = true;
  selectedSlice = null;

  // Reset cooldown after 3 seconds (adjust if needed)
  setTimeout(() => {
    spinCooldown = false;
  }, 3000);

  // Failsafe stop in 8s if needed
  setTimeout(() => {
    if (isSpinning) {
      isSpinning = false;
      finalizeSelection();
      stopSound.play();
      spinButton.disabled = false;
      dropdown.disabled = false;
    }
  }, 8000);
});

// === Handle Spacebar to Stop ===
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && isSpinning) {
    spinVelocity *= 0.96; // Faster decay
  }
});


// === Finalize Selected Slice ===
function finalizeSelection() {
  const normalizedRotation = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

  // Rotate by -PI/2 to make 12 o'clock the "0" position
  const adjustedRotation = (normalizedRotation + Math.PI / 2) % (2 * Math.PI);

  const sliceIndex = Math.floor((totalSlices - (adjustedRotation / anglePerSlice)) % totalSlices);

  selectedSlice = sliceIndex;

//   if (teamSelections[sliceIndex]) {
//     alert("This color is already assigned.");
//     selectedSlice = null;
//     return;
//   }

    if (teamSelections[sliceIndex]) {
    // Auto-respin after delay if slice already assigned
    setTimeout(() => {
        spinVelocity = Math.random() * 0.2 + 0.3;
        isSpinning = true;
    }, 600);
    return;
    }

  highlightSlice(sliceIndex);
  dropdown.disabled = false;

//   if (teamSelections.length >= totalSlices) {
//   spinButton.disabled = true;
//   spinButton.textContent = "All Teams Assigned 🎉";
//   dropdown.disabled = true;
// }

if (Object.keys(teamSelections).length >= totalSlices) {
  spinButton.disabled = true;
  spinButton.textContent = "All Teams Assigned 🎉";
  dropdown.disabled = true;

  // 🎉 Confetti Animation
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
}

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, i * 300);
}

}


// === Highlight Selected Slice ===
function highlightSlice(index) {
  const sliceAngle = index * anglePerSlice;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(sliceAngle + anglePerSlice / 2);
  ctx.beginPath();
  ctx.arc(0, 0, radius, -anglePerSlice / 2, anglePerSlice / 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.restore();
}

// Part 3: Assigning team names from the dropdown, Undo functionality, PDF export, Progress indicator updates

// === Assign Team on Dropdown Selection ===
dropdown.addEventListener("change", () => {
  const teamName = dropdown.value;

  if (!teamName || selectedSlice === null) return;

  teamSelections[selectedSlice] = teamName;
  history.push({ slice: selectedSlice, team: teamName });
  dropdown.options[dropdown.selectedIndex].disabled = true;
  dropdown.selectedIndex = 0;
  dropdown.disabled = true;
  updateProgress();

  selectedSlice = null;
  drawWheel();
});

// === Undo Last Assignment ===
undoButton.addEventListener("click", () => {
  if (!history.length) return;

  const last = history.pop();
  teamSelections[last.slice] = null;

  // Re-enable dropdown option
  for (let i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].text === last.team) {
      dropdown.options[i].disabled = false;
      break;
    }
  }

  selectedSlice = last.slice;
  dropdown.disabled = false;
  updateProgress();
  drawWheel();
});

// === Update Progress Text ===
function updateProgress() {
  const count = history.length;
  progress.textContent = `${count} / ${totalSlices} teams selected`;

  if (count === totalSlices) {
    spinButton.disabled = true;
    dropdown.disabled = true;
    exportButton.disabled = false;
  } else {
    spinButton.disabled = false;
    exportButton.disabled = true;
  }
}

// === Export to PDF ===
// exportButton.addEventListener("click", () => {
//   const link = document.createElement("a");
//   link.download = "jersey_selection_wheel.pdf";

//   const wheelImage = canvas.toDataURL("image/png");

//   const pdfWindow = window.open('', '_blank');
//   pdfWindow.document.write(`
//     <html>
//       <head><title>Export</title></head>
//       <body style="text-align:center;font-family:sans-serif;">
//         <h1>Panthers Super League 2025 - Final Jersey Colors</h1>
//         <img src="${wheelImage}" style="max-width:100%;"/>
//         <ul style="list-style:none;padding:0;font-size:1.1em;">
//           ${teamSelections.map((team, i) => `<li><b>Color ${i + 1}:</b> ${team}</li>`).join("")}
//         </ul>
//       </body>
//     </html>
//   `);

//   pdfWindow.document.close();
//   pdfWindow.print();
// });

exportButton.addEventListener("click", () => {
  const exportSection = document.getElementById("exportSection");
  const exportWheelImage = document.getElementById("exportWheelImage");
  const exportList = document.getElementById("exportList");
  const exportDate = document.getElementById("exportDate");

  // Update wheel image
  exportWheelImage.src = canvas.toDataURL("image/png");

  // Update team list
  exportList.innerHTML = teamSelections
    .map((team, i) => `<li><b>Color ${i + 1}:</b> ${team}</li>`)
    .join("");

  // Update timestamp
  exportDate.textContent = new Date().toLocaleString();

  // Create PDF
  const opt = {
    margin:       0.5,
    filename:     'jersey_selection_wheel.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(exportSection).save();
});



// === Start Drawing Loop ===
updateProgress();
animate();

//Reset Button
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
  // Clear selections
  teamSelections = [];
  selectedSlice = null;
  rotation = 0;
  spinVelocity = 0;
  isSpinning = false;

  // Re-enable everything
  spinButton.disabled = false;
  spinButton.textContent = "🎯 Spin";
  dropdown.disabled = true;

  // Remove styles from slices
  sliceColors.forEach((_, i) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Reset UI
  drawWheel();
  updateProgressDisplay();
});
