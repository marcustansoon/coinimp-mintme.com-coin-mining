let input = document.getElementById('input')
    showInput = document.getElementById('showInput'),
    video = document.getElementById('video');

	let interval=null;
    
    start(parseInt(input.value));//init
    showInput.innerHTML='Trigger dummy video every ' +input.value+' seconds';
    
    input.onchange=function(){//changes to input will automatically reset and update the video playrate 
    	reset();//reset setInterval
        start(parseInt(input.value));//start the setInterval
        showInput.innerHTML='Trigger dummy video every ' +input.value+' seconds';
    }
    	
    function start(num)//set the playrate and start the setInterval
    {
    	interval = setInterval(function(){
        	video.play();
        },num*1000);
    }
    
    function reset()//reset the setInterval
    {
    	clearInterval(interval);
        interval=null;
    }
