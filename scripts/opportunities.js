
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("opportunitiesGrid");
    const filter = document.getElementById("categoryFilter");
  
    function renderOpportunities() {
      const selectedCategory = filter.value;
  
      const filteredOpportunities =
        selectedCategory === "All"
          ? opportunities
          : opportunities.filter(
              (opportunity) => opportunity.category === selectedCategory
            );
  
      if (filteredOpportunities.length === 0) {
        grid.innerHTML = `
          <p class="empty-state">
            No opportunities in this category yet. Try another category.
          </p>
        `;
        return;
      }
  
      grid.innerHTML = filteredOpportunities
        .map(
          (opportunity) => `
            <article class="opportunity-card">
              <span class="opportunity-category">
                ${opportunity.category}
              </span>
              <h3>${opportunity.title}</h3>
              <p>${opportunity.description}</p>
              <span class="opportunity-deadline">
                ${opportunity.deadline}
              </span>
              <span class="opportunity-status">
                ${opportunity.status}
              </span>
            </article>
          `
        )
        .join("");
    }
  
    filter.addEventListener("change", renderOpportunities);
  
    renderOpportunities();
  });
  