
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("alumniTableBody");
  
    // Load Aline's saved information from this browser.
    const savedGraduate = localStorage.getItem("starlightGraduate");
    const graduate = savedGraduate
      ? { ...graduateData, ...JSON.parse(savedGraduate) }
      : { ...graduateData };
  
    const savedCheckin = localStorage.getItem("starlightCheckin");
    const answers = savedCheckin ? JSON.parse(savedCheckin) : null;
  
    const educationStatus = answers
      ? answers.educationStatus
      : graduate.educationStatus;
  
    const stemStatus = answers
      ? answers.stemStatus
      : graduate.stemStatus;
  
    // Update only Aline's row. Other records remain fictional examples.
    const rows = tableBody.querySelectorAll("tr");
  
    if (rows.length > 0) {
      rows[0].innerHTML = `
        <td>${graduate.name}</td>
        <td>${educationStatus}</td>
        <td>${stemStatus}</td>
        <td>${graduate.checkInsCompleted} / ${graduate.totalMonths}</td>
      `;
    }
  });
  