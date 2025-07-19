// Auto-Switch Script for Switching the theme
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const today = new Date();
  const month = today.getMonth() + 1; // Months are 0-indexed
  const date = today.getDate();

  // Clear all theme classes first
  body.classList.remove("diwali-theme", "republic-theme", "independence-theme", "ganesh-theme", "holi-theme");

  // Before checking date
  body.classList.add("default-theme");

  // Then override if seasonal match
  // Republic Day – Jan 26
  if (month === 1 && date === 26) {
    body.classList.replace("default-theme", "republic-theme");
  }

  // Diwali – Broad Range: Mid-Oct to Mid-Nov
  else if ((month === 10 && date >= 10) || (month === 11 && date <= 20)) {
    body.classList.replace("default-theme", "diwali-theme");
  } 
  
  // Independence Day – Aug 15
  else if (month === 8 && date === 15) {
    body.classList.replace("default-theme", "independence-theme");
  } 
  
  // Ganesh Chaturti - Aug 27
  else if (month === 8 && date === 27) {
    body.classList.replace("default-theme", "ganesh-theme");
  } 

  // Holi – Broad Range: Mid-March to Mid-March
  else if (month === 3 && date >= 3 && date <= 20) {
    body.classList.replace("default-theme", "holi-theme");
  }
});