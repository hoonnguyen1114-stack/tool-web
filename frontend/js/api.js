async function generateVariants(mode) {
  if (!lastData || lastData.length === 0) {
    showToast("❌ Vui lòng tải file trước!", "error");
    return;
  }

  let chosen = [];
  let payload = {};

  if (mode === "custom") {
    const suffixes = document.getElementById("customSuffixes").value.split("\n").filter(x => x.trim());
    const prefixes = document.getElementById("customPrefixes").value.split("\n").filter(x => x.trim());
    const separators = document.getElementById("customSeparators").value.split("\n").filter(x => x.trim());

    payload = {
      data: lastData,
      prefixes: prefixes,
      suffixes: suffixes,
      separators: separators,
      maxResults: parseInt(document.getElementById("maxResults").value)
    };
  } else {
    const selector = mode === "basic" ? "#basicRulesContainer" : "#advancedRulesContainer";
    chosen = Array.from(document.querySelectorAll(`${selector} input:checked`))
      .map((c) => c.value);

    if (chosen.length === 0) {
      showToast("❌ Vui lòng chọn ít nhất một quy tắc!", "error");
      return;
    }

    payload = {
      data: lastData,
      rules: chosen,
      depth: parseInt(document.getElementById("mutationDepth").value),
      maxResults: parseInt(document.getElementById("maxResults").value),
      chunkSize: parseInt(document.getElementById("chunkSize").value)
    };
  }

  isProcessing = true;
  document.getElementById("generateBasicBtn").disabled = true;
  document.getElementById("generateAdvBtn").disabled = true;
  document.getElementById("stopBtn").style.display = "inline-flex";
  document.getElementById("progressSection").classList.add("active");
  updateProgress(0, 100);

  try {
    const endpoint = mode === "custom" ? "custom" : mode;
    const response = await fetch(API_ENDPOINTS[endpoint], {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }

    const result = await response.json();

    allResults = result.allResults || [];
    displayResults();

    const ratio = result.ratio || 0;
    document.getElementById("statsVariants").textContent = result.totalGenerated;
    document.getElementById("statsRatio").textContent = ratio + "x";

    updateProgress(100, 100);
    showToast(
      `✅ Tạo ${result.totalGenerated} variants từ ${result.totalInput} cặp!`,
      "success"
    );
  } catch (error) {
    console.error("Error:", error);
    showToast(`❌ Lỗi: ${error.message}`, "error");
  } finally {
    isProcessing = false;
    document.getElementById("generateBasicBtn").disabled = false;
    document.getElementById("generateAdvBtn").disabled = false;
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("progressSection").classList.remove("active");
    updateButtonStates();
  }
}
