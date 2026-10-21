
document.addEventListener("DOMContentLoaded", () => {
    const savedGraduate = localStorage.getItem("starlightGraduate");
    const graduate = savedGraduate
      ? { ...graduateData, ...JSON.parse(savedGraduate) }
      : { ...graduateData };
  
    const savedCheckin = localStorage.getItem("starlightCheckin");
  
    // Restore the latest submitted education and STEM status.
    if (savedCheckin) {
      const answers = JSON.parse(savedCheckin);
      graduate.educationStatus = answers.educationStatus || graduate.educationStatus;
      graduate.stemStatus = answers.stemStatus || graduate.stemStatus;
    }
  
    const progress = Math.min(
      (graduate.checkInsCompleted / graduate.totalMonths) * 100,
      100
    );
  
    const rewardTotal = graduate.checkInsCompleted * graduate.monthlyReward;
  
    const nextMilestone = milestoneDetails.find(
      (milestone) => milestone.months > graduate.checkInsCompleted
    );
  
    const welcomeName = document.getElementById("welcomeName");
    if (welcomeName) welcomeName.textContent = graduate.name;
  
    const checkinTitle = document.getElementById("checkinTitle");
    const checkinDescription = document.getElementById("checkinDescription");
    const checkinButton = document.getElementById("checkinButton");
    const checkinStatus = document.getElementById("checkinStatus");
  
    if (checkinTitle && checkinDescription && checkinButton && checkinStatus) {
      if (graduate.checkInCompletedThisMonth) {
        checkinTitle.textContent = "You checked in this month!";
        checkinDescription.textContent =
          "Thank you for staying connected. Keep building your STEM journey.";
        checkinButton.textContent = "View your check-in";
        checkinStatus.textContent = "Completed";
      } else {
        checkinTitle.textContent = "Your monthly check-in is waiting";
        checkinDescription.textContent =
          "Take a minute to share your progress and stay connected to new opportunities.";
        checkinButton.textContent = "Complete check-in";
        checkinStatus.textContent = "Due this month";
      }
    }
  
    const rewardElement = document.getElementById("rewardTotal");
    if (rewardElement) rewardElement.textContent = `$${rewardTotal.toFixed(2)}`;
  
    const streakElement = document.getElementById("streakCount");
    if (streakElement) streakElement.textContent = graduate.currentStreak;
  
    const milestoneCount = document.getElementById("milestoneCount");
    if (milestoneCount) {
      milestoneCount.textContent =
        `${graduate.checkInsCompleted}/${graduate.totalMonths}`;
    }
  
    const milestoneDescription = document.getElementById("milestoneDescription");
    if (milestoneDescription) {
      milestoneDescription.textContent =
        graduate.checkInsCompleted === graduate.totalMonths
          ? "All 12 check-ins completed!"
          : "Monthly check-ins completed";
    }
  
    const progressLabel = document.getElementById("progressLabel");
    if (progressLabel) {
      progressLabel.textContent =
        `${graduate.checkInsCompleted} of ${graduate.totalMonths} months`;
    }
  
    const progressFill = document.getElementById("progressFill");
    if (progressFill) progressFill.style.width = `${progress}%`;
  
    const journeyProgress = document.getElementById("journeyProgress");
    if (journeyProgress) {
      journeyProgress.setAttribute("aria-valuenow", graduate.checkInsCompleted);
    }
  
    const milestoneMessage = document.getElementById("milestoneMessage");
    if (milestoneMessage) {
      if (graduate.checkInsCompleted === graduate.totalMonths) {
        milestoneMessage.textContent =
          "Congratulations! You have completed your 12-month journey.";
      } else if (nextMilestone) {
        const remaining = nextMilestone.months - graduate.checkInsCompleted;
        milestoneMessage.textContent =
          `${remaining} more check-in${remaining === 1 ? "" : "s"} until your ` +
          `${nextMilestone.months}-month milestone.`;
      } else {
        milestoneMessage.textContent = "Your 12-month journey is complete!";
      }
    }
  
    const opportunityList = document.getElementById("opportunityList");
  
    if (opportunityList) {
      opportunityList.innerHTML = opportunities
        .slice(0, 2)
        .map((opportunity) => `
          <article class="opportunity-card">
            <span class="opportunity-category">${opportunity.category}</span>
            <h3>${opportunity.title}</h3>
            <p>${opportunity.description}</p>
            <span class="opportunity-deadline">${opportunity.deadline}</span>
          </article>
        `)
        .join("");
    }
  });
  