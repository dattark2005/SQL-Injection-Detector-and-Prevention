chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    const currentUrl = tabs[0].url;
    sendRequest(currentUrl); 
});


const sendRequest = async (url) => { 
    const request = await fetch("http://127.0.0.1:5000/url", {
        method: "POST", 
        body: JSON.stringify({ 
            "url": url
        })
    }); 

    const response = await request.json(); 

    console.log("requset sent", response)
}