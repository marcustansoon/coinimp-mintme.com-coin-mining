"use strict"
	let isMining=false,
    startmining = document.getElementById('startmining'),
    getminingspeed = document.getElementById('getminingspeed'), 
    showminingspeed = document.getElementById('showminingspeed'),
    
    showhashespersecond = document.getElementById('showhashespersecond'),
    shownumthreads = document.getElementById('shownumthreads'),
    showtotalhashes = document.getElementById('showtotalhashes'),
    getnumthreads = document.getElementById('getnumthreads'),
    showstatus = document.getElementById('showstatus'),
    job = document.getElementById('job'),
    jobstatus = document.getElementById('jobstatus'),
    consolebtn = document.getElementById('console'),
    jobreceived = document.getElementById('jobreceived'),
    totaljob = document.getElementById('totaljob'),
    interval;
    
    
    
    let miner = new Client.Anonymous('b278f599bac777362fdfe7e0a99c125eb9452236336326e246a1e449e8bd5202', {
        throttle: 0.9//init speed
    });
    
    
    let maxthreads=parseInt(miner.getNumThreads()),//get max threads on this device
    mobile=miner.isMobile();
    if (mobile)
    {
    	consolebtn.style="width:35%;height:100%;font-size:3vw";
        startmining.style="width:35%;height:100%;font-size:3vw";
        document.getElementById('err').style="width:30%;height:100%;font-size:3vw";
    	getnumthreads.style="width:30%;font-size:3vw;"
    }
    
    //init func,called during startup
    function init()
    {
      console.log('Init Setup');

		if (mobile)
        	document.getElementById('totalnumthreads').innerHTML="Running on mobile<br>";
        
      document.getElementById('totalnumthreads').innerHTML+="Note : Total max threads detected on this device is " + miner.getNumThreads();
      if (mobile)
      	
      
      getnumthreads.onchange();
      console.log('Threads is set to '+miner.getNumThreads());
      getminingspeed.onchange();//show hashrate and total hashes
      showhashespersecond.innerHTML="Hashes Per Second : "+miner.getHashesPerSecond()+" H/s";
      showtotalhashes.innerHTML="Total Hashes : "+miner.getTotalHashes();
      
      showstatus.innerHTML="Mining Stopped...";//inform user that mining is stopped
      showstatus.style="color:red;font-size:18px;";
    
    }
    
    getnumthreads.onchange=function()//whenever 'num threads' input is changed, automatically sync it with the miner settings
    {
    	let temp=parseInt(getnumthreads.value);
    	if (temp>maxthreads)//check if the numthreads' input is more than the max threads detected on device
        {
        	getnumthreads.value=maxthreads;//if so, ignore the input, set the numthread of miner to max
            console.log('Note : Max threads is '+maxthreads);
            return;
        }
        miner.setNumThreads(temp);//sync the numthread input with the miner settings
        console.log("Threads used : "+miner.getNumThreads());
        shownumthreads.innerHTML="Threads used : "+miner.getNumThreads();
    }
    
    getminingspeed.onchange=function()//whenever 'mining speed' input is changed, automatically sync it with the miner settings
    {
    	let temp = Math.round((1-parseInt(getminingspeed.value)/10)*100)/100;//convert mining speed to throttle
        
    	miner.setThrottle(temp);
        showminingspeed.innerHTML="<i class='em em-rocket'></i> Mining Speed : "+getminingspeed.value+"0 %";//show mining speed
        temp =Math.round((1-miner.getThrottle())*100);
        
        console.log("Mining Speed changed to " + temp+ "%");
    }
    
    
    
    
	function toggleMining()
    {
		if (isMining)//check if mining is running, if so, stop it
        {
        	isMining=false;
        	miner.stop();//stop the mining
            showstatus.innerHTML="Mining Stopped...";
            showstatus.style="color:red;font-size:18px;";
            startmining.value="Start Mining Process";
            clearInterval(interval);//stop the display interval func
            return;
        }
        //if mining is NOT running, activate it
        isMining=true;
        miner.start();//start mining process
        showstatus.style="color:green;font-size:18px;";
        startmining.value="Stop Mining Process";
        showstatus.innerHTML="Mining Started...";
        startInterval();//start the interval func
        
	}


	init();//invoket init function
    
    //callback func 
    miner.on('error',function(text){//on error, display the error msg
    	console.log("Error Message : " +text.error);  
        document.getElementById('errormsg').innerHTML="<i class='em em-no_entry_sign'></i> "+text.error;
    });
    let total_jobs=0,total_jobs_received=0,prev_job_done;
    miner.on('job',function(text){//on receive new job callback
    	console.log("New Job received : "+text.job_id);  
        document.getElementById('errormsg').innerHTML="";//automatically clear error whenever a new job is received
        showstatus.innerHTML="Mining Started...";
        jobreceived.innerHTML=++total_jobs_received;
        job.innerHTML=text.job_id;
    });
    miner.on('found',function(text){//on done job callback
    	if (prev_job_done==text.job_id)//check if job done is equivalent to prev job done
        {
        	return;//if so, do nothing,ensure that the job completed count is accurate
        }
        
        prev_job_done=text.job_id;    
    	console.log("Job "+text.job_id+" is done"); 
        totaljob.innerHTML=++total_jobs;
        jobstatus.innerHTML=text.job_id+" <i class='em em-ok_hand'></i>";
    });
    
    
    function startInterval(){//for displaying hashrate,error,total hashes and mining status
    	
      interval = setInterval(function()
      {
      		if (!miner.isRunning())//check if miner is actually running when user activates it
            {
            	console.log("Note : Mining NOT running");//if failed, then inform user about it
                showstatus.innerHTML="<i class='em em-warning'></i>"+"Warning : Mining NOT running"; 
            }
          
          let temp=miner.getHashesPerSecond();
         
         if (mobile) 
         temp =Math.round(miner.getHashesPerSecond()*10000000)/10000000;
          
          showhashespersecond.innerHTML="Hashes Per Second : "+temp+" H/s" + "  <i class='em em-clock9'></i>";//display hashrate
          showtotalhashes.innerHTML="Total Hashes : "+miner.getTotalHashes() + "  <i class='em em-scales'></i>";//display total hashes

      },2500);

	}

	function clearError()//for clearing error text
    {
		document.getElementById('errormsg').innerHTML="";
	}
    
    
    let console_code=console.log,isConsoleDisabled=false;
    
    function toggleConsole()
    {
		if (isConsoleDisabled)//enable console if its currently disabled
        {
        	isConsoleDisabled=false;
        	console.log=console_code;
            consolebtn.value="Disable Console";
            return;
        }	
        isConsoleDisabled=true;
        console.log=function(){};
        consolebtn.value="Enable Console";
	}
    	
