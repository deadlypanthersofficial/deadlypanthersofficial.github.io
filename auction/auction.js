// Countdown Timer
function updateCountdown() {
  const end = new Date("Aug 02, 2025 15:00:00").getTime();
  const now = new Date().getTime();
  const gap = end - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  document.getElementById("days").innerText = Math.floor(gap / day);
  document.getElementById("hours").innerText = Math.floor((gap % day) / hour);
  document.getElementById("minutes").innerText = Math.floor((gap % hour) / minute);
  document.getElementById("seconds").innerText = Math.floor((gap % minute) / second);
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Load Navbar and Footer
fetch("navbar.html").then(res => res.text()).then(data => {
  document.getElementById("navbar-placeholder").innerHTML = data;
});
fetch("footer.html").then(res => res.text()).then(data => {
  document.getElementById("footer-placeholder").innerHTML = data;
});

// Switch Toggle
document.getElementById("home-toggle").addEventListener("click", () => {
  window.location.href = "/index.html";
});
document.getElementById("auction-toggle").addEventListener("click", () => {
  window.location.href = "/auction/auction-demo/auction-demo.html";
});
