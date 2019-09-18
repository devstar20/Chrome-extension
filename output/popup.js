function scrapeThePage() {
    // Keep this function isolated - it can only call methods you set up in content scripts
    var htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

document.addEventListener('DOMContentLoaded', () => {
    // Hook up #check-1 button in popup.html
    const fbshare = document.querySelector('#goto');
    fbshare.addEventListener('click', async () => {
        // Get the active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];

        // We have to convert the function to a string
        const scriptToExec = `(${scrapeThePage})()`;

        // Run the script in the context of the tab
        const scraped = await chrome.tabs.executeScript(tab.id, { code: scriptToExec });


        var context = scraped[0];
        var str = 'name="description"';
        var res = context.split(str);
        var content = "";

        if(typeof res[1] === 'undefined'){
            

        }else{
            var temp = res[1].split(">")[0];
            var n = temp.indexOf("content");
            
            for(var i = n + 9; i < temp.length - 1; i ++){
                content += temp[i];
            }
        }

        myWindow=window.open('output.html');
            var dom = '<div class="ct-coll-item">'
                    + '<hr class="ct-coll-emailsep" style="border: 0; margin: 40px auto;">' 
                 +'<article>'
                 +' <a class="ct-coll-thumb" target="_blank" href="'+ tab.url +'"></a>' 
                 + ' <h2><a target="_blank" style="display: block; padding: 1rem 0 0; text-decoration: none;" href="'+ tab.url +'">'+ tab.title +'</a></h2>'
                 + '<p>'+ content +'</p>'
                 + '<a class="ct-coll-link" target="_blank" href="'+ tab.url +'">Check it out</a>'
                 + '</article>'
                 + '</div>';
            myWindow.document.write(dom);
            myWindow.focus()

    });
});