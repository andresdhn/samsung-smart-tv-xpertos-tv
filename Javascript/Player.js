var Player =
{
    plugin : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4,
	BUFFER : 5
	
}

Player.init = function()
{
    var success = true;
          alert("success vale :  " + success);    
    this.state = this.STOPPED;
    
    this.plugin = document.getElementById("pluginPlayer");
    
    if (!this.plugin)
    {
         alert("success vale this.plugin :  " + success);    
         success = false;
    }
    
	
    alert("success vale :  " + success);    
    
    this.setWindow();
    
    alert("success vale :  " + success);    
    
    this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
    this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
    this.plugin.OnBufferingStart = 'Player.onBufferingStart';
    this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';
	this.plugin.onServerError = 'Player.onServerError';
	this.plugin.OnNetworkDisconnected = 'Player.OnNetworkDisconnected';
    this.plugin.OnRenderingComplete ='Player.onRenderingComplete';
	this.plugin.OnRenderError = 'Player.onRenderError';
	this.plugin.OnConnectionFailed = 'Player.onConnectionFailed';
	this.plugin.onStreamNotFound = 'Player.onStreamNotFound';
	
    alert("success vale :  " + success);       
    return success;
}

Player.deinit = function()
{
      alert("Player deinit !!! " );       
      
      if (this.plugin)
      {
            //this.plugin.Stop();
			Player.stopVideo();
      }
}
/* ----------------------------- Change player position     ----------------------------- */
/* ----------------------------- left / top / with / height ----------------------------- */
Player.setWindow = function()
{
    this.plugin.SetDisplayArea(430, 172, 470, 266);
}

Player.setFullscreen = function()
{
    this.plugin.SetDisplayArea(0, 0, 960, 540);
}

/* ----------------------------- Change player position     ----------------------------- */

Player.setVideoURL = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
}

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
        this.state = this.PLAYING;
        document.getElementById("play").style.display = 'block';
		document.getElementById("play").style.opacity = '2.0';
        document.getElementById("stop").style.display = 'none';
        document.getElementById("pause").style.display = 'none';
        document.getElementById("forward").style.display = 'none';
        document.getElementById("rewind").style.display = 'none';
        Display.status("Play");
		document.getElementById("description").style.display = "none";
        this.setWindow();
		alert( this.url );
        this.plugin.Play( this.url );
        Audio.plugin.SetSystemMute(false); 
    }
}

Player.pauseVideo = function()
{
    this.state = this.PAUSED;
    document.getElementById("play").style.display = 'none';
	document.getElementById("stop").style.display = 'none';
	document.getElementById("pause").style.display = 'block';
	document.getElementById("forward").style.display = 'none';
	document.getElementById("rewind").style.display = 'none';
    Display.status("Pause");
	loading.hide();
    this.plugin.Pause();
}

Player.stopVideo = function()
{
    if (this.state != this.STOPPED)
    {
        this.state = this.STOPPED;
        document.getElementById("play").style.display = 'none';
        document.getElementById("stop").style.display = 'block';
        document.getElementById("pause").style.display = 'none';
        document.getElementById("forward").style.display = 'none';
        document.getElementById("rewind").style.display = 'none';
        Display.status("Stop");
		loading.hide();
        this.plugin.Stop();
        Display.setTime(0);
        document.getElementById("description").style.display = "block";
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function()
{
    this.state = this.PLAYING;
    document.getElementById("play").style.display = 'block';
	document.getElementById("stop").style.display = 'none';
	document.getElementById("pause").style.display = 'none';
	document.getElementById("forward").style.display = 'none';
	document.getElementById("rewind").style.display = 'none';
    Display.status("Play");
    this.plugin.Resume();
	
}

Player.skipForwardVideo = function()
{
	
	document.getElementById("play").style.display = 'none';
	document.getElementById("stop").style.display = 'none';
	document.getElementById("pause").style.display = 'none';
	document.getElementById("forward").style.display = 'block';
	document.getElementById("rewind").style.display = 'none';
	
	this.skipState = this.FORWARD;
	this.plugin.JumpForward(20);

}

Player.skipBackwardVideo = function()
{
	
	document.getElementById("play").style.display = 'none';
	document.getElementById("stop").style.display = 'none';
	document.getElementById("pause").style.display = 'none';
	document.getElementById("forward").style.display = 'none';
	document.getElementById("rewind").style.display = 'block';
	
	this.skipState = this.REWIND;
	this.plugin.JumpBackward(20);

}

Player.getState = function()
{
    return this.state;
}

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
    //Display.status("Buffering...");
	this.state = this.BUFFER;
	loading.show();
	
}

Player.onBufferingProgress = function(percent)
{
    Display.status(percent + "%");
}

Player.onBufferingComplete = function()
{
	this.state = this.PLAYING;
	Display.status("Play");
	loading.hide();
	
	document.getElementById("play").style.display = 'block';
	document.getElementById("stop").style.display = 'none';
	document.getElementById("pause").style.display = 'none';
	document.getElementById("forward").style.display = 'none';
	document.getElementById("rewind").style.display = 'none';

}

Player.setCurTime = function(time)
{
    Display.setTime(time);
}

Player.setTotalTime = function()
{
    Display.setTotalTime(Player.plugin.GetDuration());
}

Player.onRenderingComplete = function() 
{
	    Player.stopVideo();
}

Player.onServerError = function()
{
    Display.status("Server Error!");
}

Player.OnNetworkDisconnected = function()
{
    Display.status("Network Error!");
}

Player.onConnectionFailed = function()
{
    Display.status("Connection Failed!");
}

Player.onStreamNotFound = function()
{
    Display.status("Stream not Found!");
}

Player.onRenderError = function() { 
	Display.status("Rendering Error!");
}



getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }



stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }

