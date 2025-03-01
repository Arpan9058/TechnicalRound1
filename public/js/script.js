const videoElement = document.getElementById('webcam');
        const startStopButton = document.getElementById('startStopButton');
        const transcriptionDiv = document.getElementById('transcription');
        const webcamStatus = document.getElementById('webcam-status');
        const questionDisplay = document.getElementById('questionDisplay');
        const questionDifficulty = 'easy';
        let recognition;
        let isRecording = false;
        let finalTranscript = ''; 
        let isTranscriptionSent = false; 
        let questionCounter = 0; 
        const maxQuestions = 3; 
        async function getMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({  audio: true });
                videoElement.srcObject = stream;
                console.log('Webcam stream active');
            } catch (err) {
                console.error('Error accessing media devices:', err);
                alert('Unable to access webcam and microphone. Please ensure permissions are granted.');
                startStopButton.disabled = true; 
                webcamStatus.textContent = 'Webcam and Audio Not Accessible';
                webcamStatus.classList.add('bg-red-500');
            }
        }
        function startRecognition() {
            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
            } else if ('SpeechRecognition' in window) {
                recognition = new SpeechRecognition();
            } else {
                transcriptionDiv.textContent = 'Speech Recognition is not supported in your browser.';
                startStopButton.disabled = true;
                return;
            }

            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function () {
                isRecording = true;
                startStopButton.textContent = 'Stop Recording';
                transcriptionDiv.textContent = ''; 
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error:', event.error);
                transcriptionDiv.textContent = 'Error during speech recognition. Please try again.';
                stopRecognition();
            };

            recognition.onend = function () {
                console.log('Speech recognition ended');
               
                if (!isTranscriptionSent) {
                    stopRecognition();
                }
            };

            recognition.onresult = function (event) {
               
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
               
                transcriptionDiv.innerHTML = finalTranscript;
            };

            recognition.start();
        }


        function stopRecognition() {
            if (recognition) {
                recognition.stop();
            }
            isRecording = false;
            startStopButton.textContent = 'Start Recording';


            if (finalTranscript.trim() && !isTranscriptionSent) {
                isTranscriptionSent = true; 
                sendTranscriptionToBackend(finalTranscript);
            }
        }


        async function sendTranscriptionToBackend(finalTranscript) {
            console.log("Sending transcription to backend:", finalTranscript);

            try {
                const response = await fetch('/analyze-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: finalTranscript, question: questionDisplay.textContent.replace('Question: ', ''), questionCounter: q }) // Send question too
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Analysis received from backend:", data);

               


                isTranscriptionSent = false;
                finalTranscript = '';
                questionCounter++;


                if (questionCounter >= maxQuestions) {
                    startStopButton.disabled = true;
                    startStopButton.textContent = "Interview Complete";
                }
                if (data.analysis && data.analysis.followUpQuestion && questionCounter<maxQuestions) {
                    questionDisplay.textContent = `Question: ${data.analysis.followUpQuestion}`;
                } else {
                    questionDisplay.textContent = "Question: No further questions.";  
                }

            } catch (error) {
                console.error('Error sending transcription to backend:', error);
                transcriptionDiv.innerHTML += `<br><strong>Error:</strong> Could not get next question. Please check console.`;
            }
        }


        startStopButton.addEventListener('click', () => {
            if (isRecording) {
                stopRecognition();
            } else {
                startRecognition();
            }
        });

        getMedia();