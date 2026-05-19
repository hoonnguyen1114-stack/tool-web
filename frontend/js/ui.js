let lastResult = "";
let allResults = [];
let lastData = null;
let isProcessing = false;

function initializeUI() {
  const basicContainer = document.getElementById("basicRulesContainer");
  const advancedContainer = document.getElementById("advancedRulesContainer");

  basicContainer.innerHTML = "";
  advancedContainer.innerHTML = "";

  RULES_CONFIG.forEach((group) => {
    const groupDiv1 = createRuleGroup(group, "basic");
    basicContainer.appendChild(groupDiv1);

    const groupDiv2 = createRuleGroup(group, "advanced");
    advancedContainer.appendChild(groupDiv2);
  });
}

function createRuleGroup(group, tab) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "rule-group";
  groupDiv.dataset.group = group.name;

  const label = document.createElement("label");
  label.textContent = group.name;
  groupDiv.appendChild(label);

  const subrules = document.createElement("div");
  subrules.className = "subrules";

  group.rules.forEach((rule) => {
    const ruleLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = rule.id;
    checkbox.dataset.tab = tab;
    checkbox.addEventListener("change", updateButtonStates);

    ruleLabel.appendChild(checkbox);
    ruleLabel.appendChild(document.createTextNode(rule.label));
    subrules.appendChild(ruleLabel);
  });

  groupDiv.appendChild(subrules);
  return groupDiv;
}

function updateButtonStates() {
  const hasFile = lastData !== null;
  const hasBasicRules = document.querySelectorAll('#basicRulesContainer input:checked').length > 0;
  const hasAdvRules = document.querySelectorAll('#advancedRulesContainer input:checked').length > 0;

  document.getElementById("generateBasicBtn").disabled = !hasFile || !hasBasicRules;
  document.getElementById("generateAdvBtn").disabled = !hasFile || !hasAdvRules;
  document.getElementById("clearBasicBtn").disabled = lastResult === "";
  document.getElementById("downloadBtn").disabled = lastResult === "";
  document.getElementById("copyBtn").disabled = lastResult === "";
}

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  event.target.classList.add("active");
}

function filterRules(tab) {
  const search = document.getElementById(`search${tab.charAt(0).toUpperCase() + tab.slice(1)}`).value.toLowerCase();
  const container = document.getElementById(`${tab}RulesContainer`);

  container.querySelectorAll(".rule-group").forEach(group => {
    const name = group.dataset.group.toLowerCase();
    const visible = name.includes(search) ||
      Array.from(group.querySelectorAll("label")).some(l =>
        l.textContent.toLowerCase().includes(search)
      );
    group.style.display = visible ? "" : "none";
  });
}

function setupFileUpload() {
  const fileInput = document.getElementById("fileInput");
  const uploadArea = document.getElementById("uploadArea");

  fileInput.addEventListener("change", handleFileSelect);

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.background = "#f0f2f5";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.background = "";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.background = "";
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
}

function handleFileSelect() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    lastData = parseFileContent(content);
    document.getElementById("statsFile").textContent = lastData.length;
    updateButtonStates();
    showToast(`✅ Tải ${lastData.length} cặp dữ liệu thành công!`, "success");
  };
  reader.onerror = () => {
    showToast("❌ Lỗi khi đọc file", "error");
  };
  reader.readAsText(file, "utf-8");
}

function parseFileContent(content) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes(":"))
    .map(line => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return null;
      return {
        user: line.substring(0, colonIndex).trim(),
        pass: line.substring(colonIndex + 1).trim()
      };
    })
    .filter(x => x && x.user && x.pass);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressPercent").textContent = percent + "%";
}

function displayResults() {
  const previewLines = 1000;
  const items = allResults.slice(0, previewLines);

  let output = "";
  for (const item of items) {
    output += item + "\n";
  }

  lastResult = output;
  document.getElementById("output").textContent = output || "Không có kết quả.";
  document.getElementById("count").textContent = items.length;
  document.getElementById("totalCount").textContent = allResults.length;
}

function clearAll() {
  lastResult = "";
  allResults = [];
  lastData = null;
  document.getElementById("fileInput").value = "";
  document.querySelectorAll(".rules input:checked").forEach((c) => {
    c.checked = false;
  });
  document.getElementById("output").textContent = "Chưa có dữ liệu. Vui lòng tải file lên.";
  document.getElementById("count").textContent = "0";
  document.getElementById("totalCount").textContent = "0";
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("statsFile").textContent = "0";
  document.getElementById("statsVariants").textContent = "0";
  document.getElementById("statsRatio").textContent = "0x";
  updateButtonStates();
  showToast("🗑️ Đã xóa tất cả dữ liệu!", "info");
}

function downloadResults() {
  if (allResults.length === 0) return;

  const format = document.getElementById("exportFormat").value;
  let content, filename, type;

  if (format === "csv") {
    content = "username,password\n" + allResults.map(line => {
      const [user, pass] = line.split(":");
      return `"${user}","${pass}"`;
    }).join("\n");
    filename = `passwords_${Date.now()}.csv`;
    type = "text/csv;charset=utf-8";
  } else if (format === "json") {
    const data = allResults.map(line => {
      const colonIndex = line.indexOf(":");
      return {
        username: line.substring(0, colonIndex),
        password: line.substring(colonIndex + 1)
      };
    });
    content = JSON.stringify(data, null, 2);
    filename = `passwords_${Date.now()}.json`;
    type = "application/json;charset=utf-8";
  } else {
    content = allResults.join("\n");
    filename = `passwords_${Date.now()}.txt`;
    type = "text/plain;charset=utf-8";
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
  showToast("✅ Tải file thành công!", "success");
}

function copyToClipboard() {
  if (!lastResult) return;

  navigator.clipboard.writeText(lastResult).then(() => {
    showToast("✅ Đã copy vào clipboard!", "success");
  }).catch(() => {
    showToast("❌ Lỗi khi copy!", "error");
  });
}

function stopProcessing() {
  isProcessing = false;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  setupFileUpload();
  updateButtonStates();
});
