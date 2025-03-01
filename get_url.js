// chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
//     const currentUrl = tabs[0].url;
//     sendRequest(currentUrl); 
// });


// const sendRequest = async (url) => { 
//     const request = await fetch("http://127.0.0.1:5000/url", {
//         method: "POST", 
//         body: JSON.stringify({ 
//             "url": url
//         })
//     }); 

//     const response = await request.json(); 

//     console.log("requset sent", response)
// }

document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: "getStatus" }, function(response) {
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