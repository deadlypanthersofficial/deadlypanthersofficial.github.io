// Countdown Timer
function updateCountdown() {
  const end = new Date("Aug 02, 2025 15:00:00").getTime();
  const now = new Date().getTime();
  const gap = end - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const countdownSection = document.getElementById("countdown-section");
  const dateInfo = document.querySelector(".date-info");

  if (gap <= 0) {
    // Show final message
    document.getElementById("countdown").innerHTML = `
      <div style="width:100%; text-align:center;">
        <h2 style="color:#1abc9c;">🎉 Auction Day is Here!</h2>
      </div>
    `;

    if (dateInfo) dateInfo.style.display = "none";

    // Run confetti for 5 seconds
    let duration = 5 * 1000;
    let endTime = Date.now() + duration;

    (function launchConfetti() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 }
      });

      if (Date.now() < endTime) {
        requestAnimationFrame(launchConfetti);
      }
    })();

    return;
  }

  document.getElementById("days").innerText = Math.floor(gap / day);
  document.getElementById("hours").innerText = Math.floor((gap % day) / hour);
  document.getElementById("minutes").innerText = Math.floor((gap % hour) / minute);
  document.getElementById("seconds").innerText = Math.floor((gap % minute) / second);
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Load Footer
fetch("/footer/footer.html")
    .then(res => res.text())
    .then(html => {
    document.getElementById("global-footer").innerHTML = html;
});

// Switch Toggle
document.getElementById("home-toggle").addEventListener("click", () => {
  window.location.href = "/index.html";
});
document.getElementById("auction-toggle").addEventListener("click", () => {
  window.location.href = "/auction/auction-demo/auction-demo.html";
});

// Tab switch logic
document.querySelectorAll(".tab-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    document.querySelectorAll(".tab-buttons button").forEach(b => b.classList.remove("active"));
    // Hide all contents
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    // Activate clicked tab
    btn.classList.add("active");
    const target = btn.getAttribute("data-tab");
    document.getElementById(target).classList.add("active");
  });
});

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(div => div.style.display = "none");
  document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).style.display = "block";
  event.currentTarget.classList.add("active");
}