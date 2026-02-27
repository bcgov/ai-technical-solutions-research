const aiOperatorBenchmarkDetailsHtml = `
  <p>
    Visual summary from the "Connected Service BC - AI Technical Solutions" demo (Dec 2025, 9m 16s).
    Reported test environment: Intel Xeon Gold 6542Y (5th Gen Xeon), CPU-only inference.
  </p>
  <p>
    Note: model selection in this recording reflects what was practical and trending at the time (December 2025). This was not
    an exhaustive evaluation of all available models or capabilities; it was a fit-for-purpose benchmark focused on options
    that worked reliably and showed usable performance for the demo tasks.
  </p>
  <ul class="benchmark-list">
    <li>Qwen3-VL-4B is presented as the best speed and quality balance for form OCR.</li>
    <li>SmolLM-1.7B is the fastest text triage model; larger models are used for higher extraction quality and deeper reasoning.</li>
    <li>Pattern used in demo: route simple requests to smaller models, then escalate to heavier models for complex cases.</li>
  </ul>
  <h4 class="benchmark-inline-heading">Vision models (document and form processing)</h4>
  <div class="benchmark-table-wrap">
    <table class="benchmark-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Size</th>
          <th>Image Encode</th>
          <th>Total Time</th>
          <th>Prompt Speed</th>
          <th>Gen Speed</th>
          <th>Accuracy</th>
          <th>Recommendation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>SmolVLM2-2.2B</td>
          <td>2.2B</td>
          <td>1.6 sec</td>
          <td>~2 sec</td>
          <td>91 t/s</td>
          <td>30 t/s</td>
          <td>Hallucinations</td>
          <td>Too small for forms</td>
        </tr>
        <tr>
          <td>Qwen3-VL-4B</td>
          <td>4B</td>
          <td>25 sec</td>
          <td>84 sec (~1.4 min)</td>
          <td>37 t/s</td>
          <td>15 t/s</td>
          <td>Good</td>
          <td>Recommended</td>
        </tr>
        <tr>
          <td>Qwen3-VL-8B</td>
          <td>8B</td>
          <td>50 sec</td>
          <td>135 sec (~2.2 min)</td>
          <td>21 t/s</td>
          <td>10 t/s</td>
          <td>Good</td>
          <td>Balanced OCR</td>
        </tr>
        <tr>
          <td>Devstral2-24B + VLM</td>
          <td>24B</td>
          <td>70 sec</td>
          <td>~240 sec (~4 min)</td>
          <td>20 t/s</td>
          <td>5 t/s</td>
          <td>Best</td>
          <td>Max accuracy</td>
        </tr>
        <tr>
          <td>PaddleOCR-VL</td>
          <td>0.9B</td>
          <td>-</td>
          <td>~560 sec (9+ min)</td>
          <td>-</td>
          <td>-</td>
          <td>Good</td>
          <td>Not recommended</td>
        </tr>
      </tbody>
    </table>
  </div>
  <h4 class="benchmark-inline-heading">Text models (classification, extraction, reasoning)</h4>
  <div class="benchmark-table-wrap">
    <table class="benchmark-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Size</th>
          <th>RAM/File</th>
          <th>Prompt Speed</th>
          <th>Gen Speed</th>
          <th>Best For</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>SmolLM-1.7B</td>
          <td>1.7B</td>
          <td>1 GB</td>
          <td>173 t/s</td>
          <td>42 t/s</td>
          <td>Fast classification triage</td>
        </tr>
        <tr>
          <td>Qwen2.5-3B</td>
          <td>3B</td>
          <td>2 GB</td>
          <td>148 t/s</td>
          <td>28 t/s</td>
          <td>Better quality extraction</td>
        </tr>
        <tr>
          <td>Devstral2-24B</td>
          <td>24B</td>
          <td>14 GB</td>
          <td>~20 t/s</td>
          <td>5-7 t/s</td>
          <td>Complex reasoning and coding</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

const publications = [
  {
    date: "2025-12-16",
    title: "A.I Operator 5th Gen Xeon LLM Benchmarks",
    stream: "Compute",
    type: "Video",
    url: "https://bcgov-my.sharepoint.com/personal/anthony_shivakumar_gov_bc_ca/Documents/Microsoft%20Teams%20Chat%20Files/connected_service_demo%2002.mp4?web=1",
    summary: "Connected Service BC demo showing CPU-only LLM and VLM benchmark results on Intel Xeon Gold 6542Y (5th Gen Xeon).",
    detailsHtml: aiOperatorBenchmarkDetailsHtml
  },
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

const streamRoutes = {
  Compute: "compute.html"
};

function sortNewestFirst(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getDefaultStream() {
  const host = document.querySelector(".publication-table-host");
  if (!host) return "all";
  const value = (host.dataset.defaultStream || "all").trim();
  return value.length > 0 ? value : "all";
}

function filterPublications(streamValue, query) {
  return sortNewestFirst(publications).filter((paper) => {
    const streamMatch = streamValue === "all" || paper.stream === streamValue;
    const queryMatch =
      query.length === 0 ||
      paper.title.toLowerCase().includes(query) ||
      paper.summary.toLowerCase().includes(query);
    return streamMatch && queryMatch;
  });
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

    if (paper.detailsHtml) {
      const detailsNode = document.createElement("div");
      detailsNode.className = "paper-details-rich";
      detailsNode.innerHTML = paper.detailsHtml;
      summaryBody.appendChild(detailsNode);
    }

    if (paper.url && paper.url !== "#") {
      const openLink = document.createElement("a");
      openLink.href = paper.url;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      if (paper.type === "PDF") {
        openLink.textContent = "Open PDF";
      } else if (paper.type === "Video") {
        openLink.textContent = "Open video";
      } else {
        openLink.textContent = "Open resource";
      }
      summaryBody.appendChild(openLink);
    }

    details.appendChild(summary);
    details.appendChild(summaryBody);
    titleCell.appendChild(details);

    const streamCell = document.createElement("td");
    const streamHref = streamRoutes[paper.stream];
    if (streamHref) {
      const streamLink = document.createElement("a");
      streamLink.href = streamHref;
      streamLink.className = "stream-link";
      streamLink.textContent = paper.stream;
      streamCell.appendChild(streamLink);
    } else {
      streamCell.textContent = paper.stream;
    }

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
  const filtered = filterPublications(streamFilter.value, searchInput.value.trim().toLowerCase());
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
  const defaultStream = getDefaultStream();

  if (streamFilter && searchInput) {
    if ([...streamFilter.options].some((option) => option.value === defaultStream)) {
      streamFilter.value = defaultStream;
    }
    streamFilter.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);
    applyFilters();
  } else {
    renderRows(filterPublications(defaultStream, ""));
  }

  setupRevealAnimation();

  const yearNode = document.getElementById("year");
  if (yearNode && !yearNode.textContent.trim()) {
    yearNode.textContent = new Date().getFullYear();
  }
});
