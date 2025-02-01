document.getElementById("toggle").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "toggleMonitoring" });
  });
  