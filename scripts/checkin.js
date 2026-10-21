
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkinForm");
    const message = document.getElementById("formMessage");
    const submitButton = form.querySelector('button[type="submit"]');
  
    const getGraduate = () => {
      const saved = localStorage.getItem("starlightGraduate");
      return saved
        ? { ...graduateData, ...JSON.parse(saved) }
        : { ...graduateData };
    };
  
    const savedCheckin = localStorage.getItem("starlightCheckin");
  
    if (savedCheckin) {
      const answers = JSON.parse(savedCheckin);
  
      document.getElementById("educationStatus").value =
        answers.educationStatus || "";
      document.getElementById("stemStatus").value =
        answers.stemStatus || "";
      document.getElementById("progressNotes").value =
        answers.progressNotes || "";
      document.getElementById("supportNeeds").value =
        answers.supportNeeds || "";
    }
  
    function showCompletedState() {
      const graduate = getGraduate();
  
      if (graduate.checkInCompletedThisMonth) {
        message.textContent =
          "Your check-in for this month has already been recorded. You can review your answers, but it won't count twice.";
        message.className = "form-message success";
        submitButton.textContent = "Monthly check-in recorded ✓";
      }
    }
  
    showCompletedState();
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const graduate = getGraduate();
  
      const answers = {
        educationStatus: document.getElementById("educationStatus").value,
        stemStatus: document.getElementById("stemStatus").value,
        progressNotes: document.getElementById("progressNotes").value.trim(),
        supportNeeds: document.getElementById("supportNeeds").value,
        submittedAt: new Date().toISOString()
      };
  
      const alreadyCompleted = graduate.checkInCompletedThisMonth;
  
      // Save the latest answers.
      localStorage.setItem("starlightCheckin", JSON.stringify(answers));
  
      graduate.educationStatus = answers.educationStatus;
      graduate.stemStatus = answers.stemStatus;
  
      if (!alreadyCompleted) {
        graduate.checkInsCompleted = Math.min(
          graduate.checkInsCompleted + 1,
          graduate.totalMonths
        );
  
        graduate.currentStreak += 1;
        graduate.checkInCompletedThisMonth = true;
      }
  
      localStorage.setItem("starlightGraduate", JSON.stringify(graduate));
  
      if (alreadyCompleted) {
        message.textContent =
          "Your answers have been updated. Your monthly progress and reward have not been counted again.";
      } else {
        message.textContent =
          "Your monthly check-in has been recorded! Your demo progress has been updated.";
      }
  
      message.className = "form-message success";
      submitButton.textContent = "Monthly check-in recorded ✓";
    });
  });
  