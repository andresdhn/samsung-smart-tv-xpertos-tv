var Server =
{
    /* Callback function to be set by client */
    dataReceivedCallback : null,
    
    XHRObj : null,
	Videos : "http://xpertos.tv/SmartTV/videolist2.xml",
	Noticias : "http://www.xpertos.tv/tecnologia/DesktopModules/DigArticle/RSS.ashx?portalid=0&moduleid=1497&Category=17"

}

Server.init = function()
{
    var success = true;

    if (this.XHRObj)
    {
        this.XHRObj.destroy();  // Saves memory
        this.XHRObj = null;
    }
    
    return success;
}

Server.fetchVideoList = function()
{
	
    if (this.XHRObj == null)
    {
        this.XHRObj = new XMLHttpRequest();
    }
    
    if (this.XHRObj)
    {
        this.XHRObj.onreadystatechange = function()
            {
                if (Server.XHRObj.readyState == 4)
                {
                    Server.createVideoList();
                }
            }
			
        alert("category: " + Main.selectedCategory);
		switch(Main.selectedCategory)
		{
			case 0:
				this.XHRObj.open("GET", this.Videos, true);
				break;
			case 1:
				this.XHRObj.open("GET", this.Noticias, true);
				break;
		}
        this.XHRObj.send(null);
     }
    else
    {
        alert("Failed to create XHR");
    }
}

Server.createVideoList = function()
{
	alert("XHBJO: " + this.XHRObj.status);
	if (this.XHRObj.status != 200)
    {
        Display.status("XML Server Error " + this.XHRObj.status);
		$("#error").show();
		loading.hide();
    }
    else
    {
		var xmlElement = this.XHRObj.responseXML.documentElement;
        
        if (!xmlElement)
        {
            alert("Failed to get valid XML");
			$("#error").show();
			loading.hide();
        }
        else
        {
			
            // Parse RSS
            // Get all "item" elements
            var items = xmlElement.getElementsByTagName("item");
            
            var videoNames = [ ];
            var videoURLs = [ ];
            var videoDescriptions = [ ];
            
            for (var index = 0; index < items.length; index++)
            {
				var titleElement = items[index].getElementsByTagName("title")[0];
                var descriptionElement = items[index].getElementsByTagName("description")[0];
                var linkElement = items[index].getElementsByTagName("link")[0];      
				
				if (titleElement && descriptionElement && linkElement)
                {
                    videoNames[index] = titleElement.firstChild.data;
                    videoURLs[index] = linkElement.firstChild.data;
					videoDescriptions[index] = descriptionElement.firstChild.data;
                }
            }
			
            Data.setVideoNames(videoNames);
            Data.setVideoURLs(videoURLs);
            Data.setVideoDescriptions(videoDescriptions);
			
            if (this.dataReceivedCallback)
            {
                this.dataReceivedCallback();    /* Notify all data is received and stored */
            }
        }
    }
}


