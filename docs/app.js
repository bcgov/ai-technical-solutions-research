const publications = [
  {
    date: "2025-11-17",
    title: "BC Server CPU Validation and Integration Report",
    stream: "Compute",
    type: "PDF",
    url: "assets/papers/bc_server_cpu_validation_and_integration_report.pdf",
    summary: "Validation findings for CPU performance, workload fit, and integration guidance."
  },
  {
    date: "2025-11-13",
    title: "BC Server CPU Recommendation Package",
    stream: "Compute",
    type: "PDF",
    url: "assets/papers/bc_server_cpu_recommendation_package.pdf",
    summary: "Decision package outlining recommended server CPU options for AI workloads."
  }
];

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

function sortNewestFirst(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderRows(items) {
  const tbody = document.getElementById("publicationRows");
  const emptyState = document.getElementById("emptyState");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (items.length === 0 && emptyState) {
    emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  items.forEach((paper) => {
    const tr = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = dateFormatter.format(new Date(paper.date));

    const titleCell = document.createElement("td");
    const details = document.createElement("details");
    details.className = "paper-accordion";
    const summary = document.createElement("summary");
    summary.className = "paper-title";
    summary.textContent = paper.title;
    const summaryBody = document.createElement("div");
    summaryBody.className = "paper-accordion-body";
    const summaryText = document.createElement("p");
    summaryText.textContent = paper.summary;
    summaryBody.appendChild(summaryText);
    if (paper.url && paper.url !== "#") {
      const openLink = document.createElement("a");
      openLink.href = paper.url;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      openLink.textContent = "Open PDF";
      summaryBody.appendChild(openLink);
    }
    details.appendChild(summary);
    details.appendChild(summaryBody);
    titleCell.appendChild(details);

    const streamCell = document.createElement("td");
    streamCell.textContent = paper.stream;

    const typeCell = document.createElement("td");
    typeCell.textContent = paper.type;

    tr.appendChild(dateCell);
    tr.appendChild(titleCell);
    tr.appendChild(streamCell);
    tr.appendChild(typeCell);

    tbody.appendChild(tr);
  });
}

function applyFilters() {
  const streamFilter = document.getElementById("streamFilter");
  const searchInput = document.getElementById("searchInput");
  if (!streamFilter || !searchInput) return;

  const streamValue = streamFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  const filtered = sortNewestFirst(publications).filter((paper) => {
    const streamMatch = streamValue === "all" || paper.stream === streamValue;
    const queryMatch =
      query.length === 0 ||
      paper.title.toLowerCase().includes(query) ||
      paper.summary.toLowerCase().includes(query);
    return streamMatch && queryMatch;
  });

  renderRows(filtered);
}

function setupRevealAnimation() {
  const nodes = document.querySelectorAll(".reveal");
  if (nodes.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

document.addEventListener("DOMContentLoaded", () => {
  const streamFilter = document.getElementById("streamFilter");
  const searchInput = document.getElementById("searchInput");

  if (streamFilter && searchInput) {
    streamFilter.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);
    applyFilters();
  } else {
    renderRows(sortNewestFirst(publications));
  }
  setupRevealAnimation();

  const yearNode = document.getElementById("year");
  if (yearNode && !yearNode.textContent.trim()) {
    yearNode.textContent = new Date().getFullYear();
  }
});
