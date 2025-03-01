let isMonitoring = true;


function extLog(message, data = null) {
  if (data) {
    console.log(`[SQL Injection Detector] ${message}`, data);
  } else {
    console.log(`[SQL Injection Detector] ${message}`);
  }
}

chrome.runtime.onInstalled.addListener(() => {
    extLog("Extension installed");
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'SQL Injection Detector',
        message: 'Extension installed and ready to monitor',
        priority: 2
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleMonitoring") {
        isMonitoring = message.monitoring !== undefined ? message.monitoring : !isMonitoring;
        extLog(`Monitoring ${isMonitoring ? 'enabled' : 'disabled'}`);
        
        
        if (message.action === "getStatus") {
            sendResponse({ success: true, monitoring: isMonitoring });
        }
    }
    return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isMonitoring && changeInfo.url) {
        extLog(`URL changed: ${changeInfo.url}`);
        checkUrl(changeInfo.url, tabId);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    if (isMonitoring) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab.url) {
                extLog(`Tab activated: ${tab.url}`);
                checkUrl(tab.url, tab.id);
            }
        });
    }
});

async function checkUrl(url, tabId) {
    try {
        extLog(`Checking URL: ${url}`);
        
        const response = await fetch("http://127.0.0.1:5000/url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "url": url
            })
        });
        
        const result = await response.json();
        extLog("Received response from server:", result);
        
        if (result.threat) {
            extLog(`THREAT DETECTED at ${url}`, result);
            
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'SQL Injection Warning',
                message: `Potential SQL injection vulnerability detected at ${url}`,
                priority: 2
            });
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: showWarningBanner,
                args: [result.details || "Potential SQL injection vulnerability detected"]
            });
        }
    } catch (error) {
        extLog("Error checking URL:", error.message);
        
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'SQL Injection Detector Error',
            message: `Error connecting to detection server: ${error.message}. Make sure your Flask server is running.`,
            priority: 1
        });
    }
}

function showWarningBanner(message) {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #ff4d4d;
        color: white;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        z-index: 9999;
    `;
    banner.textContent = message;
    
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        float: right;
        cursor: pointer;
        margin-right: 20px;
        font-size: 20px;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(banner);
    };
    
    banner.appendChild(closeBtn);
    document.body.prepend(banner);
}