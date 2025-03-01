document.getElementById("toggle").addEventListener("click", function() {
  chrome.runtime.sendMessage({ action: "toggleMonitoring" }, function(response) {
      if (response && response.monitoring !== undefined) {
          updatePopupUI(response.monitoring);
      }
  });
});

function updatePopupUI(isMonitoring) {
  const statusElem = document.getElementById("status");
  const toggleBtn = document.getElementById("toggle");
  
  statusElem.textContent = isMonitoring ? "Monitoring" : "Disabled";
  toggleBtn.textContent = isMonitoring ? "Disable" : "Enable";
}