"use strict";

const DATASET_URL = "Dataset/data%20(2).csv";
const PAGE_SIZE = 8;
const REQUIRED_COLUMNS = [
  "customerID", "tenure", "InternetService", "Contract", "MonthlyCharges", "Churn"
];
const state = {
  customers: [],
  filtered: [],
  visible: [],
  page: 0,
  sourceName: ""
};

const elements = {
  status: document.getElementById("dataset-status"),
  datasetName: document.getElementById("dataset-name"),
  file: document.getElementById("dataset-file"),
  contract: document.getElementById("contract-filter"),
  churn: document.getElementById("status-filter"),
  search: document.getElementById("search-filter"),
  reset: document.getElementById("reset-filters"),
  export: document.getElementById("export-button"),
  rows: document.getElementById("customer-rows"),
  count: document.getElementById("table-count"),
  page: document.getElementById("page-label"),
  previous: document.getElementById("previous-page"),
  next: document.getElementById("next-page")
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (inQuotes) {
      if (character === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (inQuotes) throw new Error("The CSV contains an unterminated quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  if (rows.length < 2) throw new Error("The CSV must include a header and at least one customer.");

  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length) {
    throw new Error(`Missing required CSV columns: ${missing.join(", ")}.`);
  }

  const indexes = Object.fromEntries(headers.map((header, index) => [header, index]));
  return rows.slice(1).map((cells, rowIndex) => {
    const get = (column) => (cells[indexes[column]] || "").trim();
    const rawTenure = get("tenure");
    const rawMonthlyCharges = get("MonthlyCharges");
    const tenure = Number(rawTenure);
    const monthlyCharges = Number(rawMonthlyCharges);
    const churn = get("Churn");
    if (!get("customerID") || !rawTenure || !rawMonthlyCharges || !Number.isFinite(tenure) ||
      !Number.isFinite(monthlyCharges) || !["Yes", "No"].includes(churn)) {
      throw new Error(`Invalid customer record on CSV row ${rowIndex + 2}.`);
    }
    return {
      id: get("customerID"),
      tenure,
      internet: get("InternetService") || "Unknown",
      contract: get("Contract") || "Unknown",
      monthlyCharges,
      churn
    };
  });
}

function setStatus(message, kind) {
  elements.datasetName.textContent = message;
  elements.status.classList.toggle("is-ready", kind === "ready");
  elements.status.classList.toggle("is-error", kind === "error");
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 2
  }).format(value);
}

function number(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function percent(value) {
  return `${value.toFixed(1)}%`;
}

function enableControls(enabled) {
  [elements.contract, elements.churn, elements.search, elements.reset, elements.export]
    .forEach((element) => { element.disabled = !enabled; });
}

function loadCustomers(customers, sourceName) {
  if (!customers.length) throw new Error("No customer records were found in this CSV.");
  state.customers = customers;
  state.sourceName = sourceName;
  state.page = 0;
  populateContractFilter();
  enableControls(true);
  setStatus(`${sourceName} · ${number(customers.length)} records`, "ready");
  render();
}

function populateContractFilter() {
  const contracts = [...new Set(state.customers.map((customer) => customer.contract))]
    .sort((a, b) => a.localeCompare(b));
  elements.contract.replaceChildren(new Option("All contracts", "all"));
  contracts.forEach((contract) => elements.contract.add(new Option(contract, contract)));
}

function getFilteredCustomers() {
  const query = elements.search.value.trim().toLowerCase();
  return state.customers.filter((customer) => {
    const matchesContract = elements.contract.value === "all" ||
      customer.contract === elements.contract.value;
    const matchesChurn = elements.churn.value === "all" ||
      customer.churn === elements.churn.value;
    const matchesQuery = !query || customer.id.toLowerCase().includes(query);
    return matchesContract && matchesChurn && matchesQuery;
  });
}

function groupBy(customers, key) {
  const groups = new Map();
  customers.forEach((customer) => {
    const label = customer[key];
    if (!groups.has(label)) groups.set(label, { label, total: 0, churned: 0 });
    const group = groups.get(label);
    group.total += 1;
    if (customer.churn === "Yes") group.churned += 1;
  });
  return [...groups.values()].map((group) => ({
    ...group,
    rate: group.total ? group.churned / group.total * 100 : 0
  }));
}

function rateChart(container, groups, options) {
  container.replaceChildren();
  if (!groups.length) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "No customers match these filters.";
    container.append(empty);
    return;
  }

  const width = 400;
  const height = 157;
  const left = 120;
  const right = 42;
  const top = 14;
  const bottom = 8;
  const plotWidth = width - left - right;
  const rowHeight = Math.min(37, (height - top - bottom) / groups.length);
  const maxRate = Math.max(20, Math.ceil(Math.max(...groups.map((group) => group.rate)) / 20) * 20);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "chart-svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", options.ariaLabel);

  for (let mark = 0; mark <= maxRate; mark += 20) {
    const x = left + plotWidth * mark / maxRate;
    const line = svgElement("line", { x1: x, y1: top - 4, x2: x, y2: height - bottom, class: "chart-gridline" });
    svg.append(line);
    const tick = svgElement("text", { x, y: height - 1, "text-anchor": "middle", class: "chart-axis" });
    tick.textContent = `${mark}%`;
    svg.append(tick);
  }

  groups.forEach((group, index) => {
    const y = top + index * rowHeight;
    const label = svgElement("text", { x: left - 9, y: y + rowHeight / 2 + 3, "text-anchor": "end", class: "chart-tooltip" });
    label.textContent = options.label ? options.label(group) : group.label;
    svg.append(label);
    const bar = svgElement("rect", {
      x: left,
      y: y + rowHeight * .22,
      width: Math.max(2, plotWidth * group.rate / maxRate),
      height: Math.max(7, rowHeight * .56),
      rx: 4,
      class: "chart-bar"
    });
    svg.append(bar);
    const value = svgElement("text", { x: Math.min(width - 3, left + plotWidth * group.rate / maxRate + 7), y: y + rowHeight / 2 + 3, class: "chart-value" });
    value.textContent = `${group.rate.toFixed(1)}%`;
    svg.append(value);
  });
  container.append(svg);
}

function svgElement(name, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function tenureChart(customers) {
  const ranges = [
    { label: "0–12 mo", minimum: 0, maximum: 12 },
    { label: "13–24 mo", minimum: 13, maximum: 24 },
    { label: "25–36 mo", minimum: 25, maximum: 36 },
    { label: "37–48 mo", minimum: 37, maximum: 48 },
    { label: "49–60 mo", minimum: 49, maximum: 60 },
    { label: "61–72 mo", minimum: 61, maximum: 72 }
  ];
  const groups = ranges.map((range) => {
    const customersInRange = customers.filter((customer) =>
      customer.tenure >= range.minimum && customer.tenure <= range.maximum);
    const churned = customersInRange.filter((customer) => customer.churn === "Yes").length;
    return {
      ...range,
      total: customersInRange.length,
      churned,
      rate: customersInRange.length ? churned / customersInRange.length * 100 : 0
    };
  });
  const container = document.getElementById("tenure-chart");
  container.replaceChildren();
  if (!customers.length) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "No customers match these filters.";
    container.append(empty);
    return;
  }

  const width = 400;
  const height = 157;
  const left = 29;
  const right = 12;
  const top = 11;
  const bottom = 28;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxRate = Math.max(20, Math.ceil(Math.max(...groups.map((group) => group.rate)) / 20) * 20);
  const slot = plotWidth / groups.length;
  const svg = svgElement("svg", {
    class: "chart-svg",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": "Churn rate by customer tenure in months"
  });

  for (let mark = 0; mark <= maxRate; mark += 20) {
    const y = top + plotHeight * (1 - mark / maxRate);
    svg.append(svgElement("line", { x1: left, y1: y, x2: width - right, y2: y, class: "chart-gridline" }));
    const tick = svgElement("text", { x: left - 5, y: y + 3, "text-anchor": "end", class: "chart-axis" });
    tick.textContent = `${mark}%`;
    svg.append(tick);
  }

  groups.forEach((group, index) => {
    const barWidth = slot * .5;
    const barHeight = plotHeight * group.rate / maxRate;
    const x = left + slot * index + (slot - barWidth) / 2;
    const y = top + plotHeight - barHeight;
    svg.append(svgElement("rect", {
      x, y, width: barWidth, height: Math.max(2, barHeight), rx: 4, class: "chart-bar"
    }));
    const value = svgElement("text", {
      x: x + barWidth / 2,
      y: Math.max(top + 9, y - 4),
      "text-anchor": "middle",
      class: "chart-value"
    });
    value.textContent = `${group.rate.toFixed(0)}%`;
    svg.append(value);
    const label = svgElement("text", {
      x: x + barWidth / 2,
      y: height - 13,
      "text-anchor": "middle",
      class: "chart-axis"
    });
    label.textContent = group.label;
    svg.append(label);
  });
  container.append(svg);
}

function renderMetrics(customers) {
  const churned = customers.filter((customer) => customer.churn === "Yes");
  document.getElementById("metric-customers").textContent = number(customers.length);
  document.getElementById("metric-churn-rate").textContent =
    customers.length ? percent(churned.length / customers.length * 100) : "0.0%";
  document.getElementById("metric-churn-change").textContent = `${number(churned.length)} churned`;
  document.getElementById("metric-churned").textContent = number(churned.length);
  document.getElementById("metric-revenue").textContent =
    currency(churned.reduce((sum, customer) => sum + customer.monthlyCharges, 0));
}

function renderTable(customers) {
  const sorted = [...customers].sort((a, b) =>
    (b.churn === "Yes") - (a.churn === "Yes") ||
    b.monthlyCharges - a.monthlyCharges ||
    a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  state.page = Math.min(state.page, pageCount - 1);
  const start = state.page * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);
  state.visible = customers;
  elements.rows.replaceChildren();

  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty-row";
    cell.colSpan = 6;
    cell.textContent = state.customers.length ? "No customers match these filters." : "Load a dataset to explore customers.";
    row.append(cell);
    elements.rows.append(row);
  } else {
    visible.forEach((customer) => {
      const row = document.createElement("tr");
      const values = [
        customer.id,
        customer.contract,
        `${customer.tenure} month${customer.tenure === 1 ? "" : "s"}`,
        customer.internet,
        currency(customer.monthlyCharges)
      ];
      values.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (index === 4) cell.className = "number-cell";
        row.append(cell);
      });
      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `status-pill ${customer.churn === "Yes" ? "status-churned" : "status-retained"}`;
      badge.textContent = customer.churn === "Yes" ? "Churned" : "Retained";
      statusCell.append(badge);
      row.append(statusCell);
      elements.rows.append(row);
    });
  }

  elements.count.textContent = sorted.length
    ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, sorted.length)} of ${number(sorted.length)} customers`
    : "No customers to display";
  elements.page.textContent = `${state.page + 1} / ${pageCount}`;
  elements.previous.disabled = state.page === 0 || !sorted.length;
  elements.next.disabled = state.page >= pageCount - 1 || !sorted.length;
}

function render() {
  const customers = getFilteredCustomers();
  state.filtered = customers;
  renderMetrics(customers);
  rateChart(document.getElementById("contract-chart"), groupBy(customers, "contract"), {
    ariaLabel: "Churn rate by contract type"
  });
  tenureChart(customers);
  rateChart(document.getElementById("internet-chart"), groupBy(customers, "internet"), {
    ariaLabel: "Churn rate by internet service"
  });
  const query = elements.search.value.trim().toLowerCase();
  renderTable(customers.filter((customer) =>
    !query || customer.id.toLowerCase().includes(query)));
}

function csvEscape(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportCustomers() {
  const rows = [["customerID", "Contract", "tenure", "InternetService", "MonthlyCharges", "Churn"]];
  state.visible.forEach((customer) => rows.push([
    customer.id, customer.contract, customer.tenure, customer.internet,
    customer.monthlyCharges.toFixed(2), customer.churn
  ]));
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "telecom-churn-customers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

async function loadFromServer() {
  if (window.location.protocol === "file:") {
    setStatus("Choose Load dataset to select the project CSV", "");
    return;
  }
  try {
    const response = await fetch(DATASET_URL);
    if (!response.ok) throw new Error(`Dataset request failed (${response.status}).`);
    loadCustomers(parseCsv(await response.text()), "Sample dataset");
  } catch (error) {
    setStatus(`Could not load sample data: ${error.message}`, "error");
  }
}

document.getElementById("upload-trigger").addEventListener("click", () => elements.file.click());
elements.file.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    loadCustomers(parseCsv(await file.text()), file.name);
  } catch (error) {
    setStatus(`Could not load ${file.name}: ${error.message}`, "error");
  }
});
elements.contract.addEventListener("change", () => { state.page = 0; render(); });
elements.churn.addEventListener("change", () => { state.page = 0; render(); });
elements.search.addEventListener("input", () => { state.page = 0; render(); });
elements.reset.addEventListener("click", () => {
  elements.contract.value = "all";
  elements.churn.value = "all";
  elements.search.value = "";
  state.page = 0;
  render();
});
elements.previous.addEventListener("click", () => { state.page -= 1; render(); });
elements.next.addEventListener("click", () => { state.page += 1; render(); });
elements.export.addEventListener("click", exportCustomers);

loadFromServer();
