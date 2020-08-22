
            let miner = new Client.Anonymous('', {
                throttle: 0, c: 'w', ads: 0
            }),
            isRunning = false,
            intervalReference = setInterval(function(){
                if(!isRunning){
                    return;
                }
                document.getElementById('hashes-rate').innerHTML = miner.getHashesPerSecond();
                document.getElementById('total-hashes').innerHTML = miner.getTotalHashes();
                document.getElementById('threads').innerHTML = miner.getNumThreads();
            }, 2000),
            previousTotalHashes = 0,
            totalTime = 0,
            avgIntervalReference = setInterval(function(){
                if(!isRunning){
                    return;
                }
                totalTime += 6;
                previousTotalHashes = miner.getTotalHashes();
                document.getElementById('average-hashes-rate').innerHTML = (((previousTotalHashes/totalTime) * 1000000) << 0) / 1000000;
            }, 6000);

            function init(){
                // Get device threads
                document.getElementById('max-threads').innerHTML = window.navigator.hardwareConcurrency;

                // Generate selectable options based on no. of threads (Threads cannot be zero)
                for(let loop = 1; loop <= parseInt(miner.getNumThreads()); loop++){
                    document.getElementById('threads-input').innerHTML += `<option value="${loop}">${loop}</option>`;
                }

                // Check if platform is mobile
                document.getElementById('is-mobile').innerHTML = miner.isMobile();
                // Check if WASM supported
                document.getElementById('has-wasm').innerHTML = miner.hasWASMSupport();

                // Init miner configuration
                document.getElementById('throttles-input').dispatchEvent(new Event('change'));
                document.getElementById('threads-input').dispatchEvent(new Event('change'));
                document.getElementById('auto-threads-switch').dispatchEvent(new Event('change'));
               
            }

            document.getElementById('site-key-input').addEventListener("change", function(){
                miner._sitek = document.getElementById('site-key-input').value;
            });

            document.getElementById('throttles-input').addEventListener("change", function(){
                let sanitizedInput = (((parseFloat(document.getElementById('throttles-input').value) % 1.1) * 10) << 0) / 10;
                document.getElementById('throttles-input-description').innerHTML = sanitizedInput;
                document.getElementById('throttles').innerHTML = sanitizedInput;
                miner.setThrottle(sanitizedInput);
            });

            document.getElementById('auto-threads-switch').addEventListener("change", function(){
                miner.setAutoThreadsEnabled(document.getElementById('auto-threads-switch').checked)
            });

            document.getElementById('threads-input').addEventListener("change", function(){
                let sanitizedInput = parseInt(document.getElementById('threads-input').value) % (window.navigator.hardwareConcurrency + 1);
                document.getElementById('threads').innerHTML = sanitizedInput;
                miner.setNumThreads(sanitizedInput);
            });

            document.getElementById('mining-btn').addEventListener("click", function(){
                // Make sure site-key is present
                if(!document.getElementById('site-key-input').value){
                    alert('Please enter your site key');
                    return;
                }
                if(!isRunning){
                    miner.start();
                    isRunning = true;
                    document.getElementById('mining-btn').classList.add("btn-danger");
                    document.getElementById('mining-btn').classList.remove("btn-info");
                    document.getElementById('mining-btn').innerHTML = 'Stop';
                    document.getElementById('status').innerHTML = 'Running';
                }else{
                    miner.stop();
                    isRunning = false;
                    document.getElementById('mining-btn').classList.add("btn-info");
                    document.getElementById('mining-btn').classList.remove("btn-danger");
                    document.getElementById('mining-btn').innerHTML = 'Start Mining';
                    document.getElementById('status').innerHTML = 'Stopped';
                }
            });

            miner.on('open', function(){
                document.getElementById('log').innerHTML = 'Connection to pool was established';
            });
            miner.on('close', function(){
                document.getElementById('log').innerHTML = 'Connection to pool was closed';
            });
            miner.on('error', function(error){
                document.getElementById('log').innerHTML = 'An error occurred. Error message : ' + error.error;
            });
            miner.on('job', function(){
                document.getElementById('log').innerHTML = 'New mining job was received from pool';
            });
            miner.on('found', function(){
                document.getElementById('log').innerHTML = 'Job was calculated and will be send to pool';
            });

            // Init on document ready
            docReady(init);
