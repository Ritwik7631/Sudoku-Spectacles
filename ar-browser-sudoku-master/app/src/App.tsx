import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Processor, { VideoReadyPayload } from "./augmentedReality/Processor";
import StatsPanel from "./components/StatsPanel";

// start processing video
const processor = new Processor();

// Solution panel component to display the complete solution
const SolutionPanel = ({ solvedPuzzle, onStopSpeech }: { solvedPuzzle: any[][], onStopSpeech: () => void }) => {
  if (!solvedPuzzle) return null;
  
  return (
    <div className="solution-panel">
      <div className="solution-header">
        <h3>Complete Solution</h3>
        <button onClick={onStopSpeech} className="stop-button">
          ⏹️ Stop Reading
        </button>
      </div>
      <div className="solution-grid">
        {solvedPuzzle.map((row, y) => (
          <div key={y} className="solution-row">
            {row.map((cell, x) => (
              <div key={x} className={`solution-cell ${cell?.isKnown ? 'known' : 'solved'}`}>
                {cell?.digit || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);

  const [videoWidth, setVideoWidth] = useState(100);
  const [videoHeight, setVideoHeight] = useState(100);
  const [solvedPuzzle, setSolvedPuzzle] = useState<any[][]>(null);

  const [imageCaptureTime, setImageCaptureTime] = useState(0);
  const [thresholdTime, setThresholdTime] = useState(0);
  const [connectedComponentTime, setConnectedComponentTime] = useState(0);
  const [getCornerPointsTime, setGetCornerPOintsTime] = useState(0);
  const [extractImageTime, setExtractImageTime] = useState(0);
  const [extractBoxesTime, setExtractBoxesTime] = useState(0);
  const [ocrTime, setOcrTime] = useState(0);
  const [solveTime, setSolveTime] = useState(0);

  // Function to stop the speech
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
  };

  // Function to read the solution
  const speakSolution = () => {
    if (!solvedPuzzle || isSpeakingRef.current) return;

    console.log('Starting speech synthesis...');
    
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Create a speech synthesis instance
    const speech = new SpeechSynthesisUtterance();
    speechRef.current = speech;
    speech.rate = 0.8; // Slightly slower rate for better comprehension
    speech.pitch = 1.0;
    
    // Build the solution text
    let solutionText = "Here is the solution. ";
    
    // Read each cell that isn't a known value
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = solvedPuzzle[y][x];
        if (cell && !cell.isKnown) {
          // Convert grid position to row/column (1-based for user-friendliness)
          const row = y + 1;
          const column = x + 1;
          solutionText += `Row ${row}, Column ${column}: ${cell.digit}. `;
        }
      }
    }
    
    console.log('Solution text:', solutionText);
    speech.text = solutionText;
    
    // Set up the end event to restart the speech
    speech.onend = () => {
      console.log('Speech ended, restarting...');
      if (isSpeakingRef.current) {
        // Small delay before restarting
        setTimeout(() => {
          window.speechSynthesis.speak(speech);
        }, 1000);
      }
    };

    speech.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    isSpeakingRef.current = true;
    window.speechSynthesis.speak(speech);
    console.log('Speech started');
  };

  // Effect to start speaking when solution is available
  useEffect(() => {
    console.log('Solution updated:', solvedPuzzle);
    if (solvedPuzzle) {
      // Small delay to ensure the solution is fully processed
      setTimeout(() => {
        speakSolution();
      }, 500);
    }
    // Cleanup function to stop speech when component unmounts
    return () => {
      stopSpeech();
    };
  }, [solvedPuzzle]);

  // start the video playing
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      processor.startVideo(video).then(
        () => console.log("Video started"),
        (error) => alert(error.message)
      );
    }
  }, [videoRef]);

  // render the overlay
  useEffect(() => {
    const interval = window.setInterval(() => {
      const canvas = previewCanvasRef.current;
      if (canvas && processor.isVideoRunning) {
        // update the peformance stats
        setImageCaptureTime(processor.captureTime);
        setThresholdTime(processor.thresholdTime);
        setConnectedComponentTime(processor.connectedComponentTime);
        setGetCornerPOintsTime(processor.cornerPointTime);
        setExtractImageTime(processor.extractPuzzleTime);
        setExtractBoxesTime(processor.extractBoxesTime);
        setOcrTime(processor.neuralNetTime);
        setSolveTime(processor.solveTime);
        
        // Update the solved puzzle state
        if (processor.solvedPuzzle) {
          setSolvedPuzzle(processor.solvedPuzzle);
        }
        
        // display the output from the processor
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(processor.video, 0, 0);
          if (processor.corners) {
            const {
              topLeft,
              topRight,
              bottomLeft,
              bottomRight,
            } = processor.corners;
            context.strokeStyle = "rgba(0,200,0,0.5)";
            context.fillStyle = "rgba(0,0,0,0.3)";
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(topLeft.x, topLeft.y);
            context.lineTo(topRight.x, topRight.y);
            context.lineTo(bottomRight.x, bottomRight.y);
            context.lineTo(bottomLeft.x, bottomLeft.y);
            context.closePath();
            context.stroke();
            context.fill();
          }
          if (processor.gridLines) {
            context.strokeStyle = "rgba(0,200,0,0.5)";
            context.lineWidth = 2;
            processor.gridLines.forEach((line) => {
              context.moveTo(line.p1.x, line.p1.y);
              context.lineTo(line.p2.x, line.p2.y);
            });
            context.stroke();
          }
          if (processor.solvedPuzzle) {
            context.fillStyle = "rgba(0,200,0,1)";
            for (let y = 0; y < 9; y++) {
              for (let x = 0; x < 9; x++) {
                if (processor.solvedPuzzle[y][x]) {
                  const {
                    digit,
                    digitHeight,
                    digitRotation,
                    position,
                    isKnown,
                  } = processor.solvedPuzzle[y][x];
                  if (!isKnown) {
                    context.font = `bold ${digitHeight}px sans-serif`;
                    context.translate(position.x, position.y);
                    context.rotate(Math.PI - digitRotation);
                    context.fillText(
                      digit.toString(),
                      -digitHeight / 4,
                      digitHeight / 3
                    );
                    context.setTransform();
                  }
                }
              }
            }
          }
        }
      }
    }, 100);
    return () => {
      window.clearInterval(interval);
    };
  }, [previewCanvasRef]);

  // update the video scale as needed
  useEffect(() => {
    function videoReadyListener({ width, height }: VideoReadyPayload) {
      setVideoWidth(width);
      setVideoHeight(height);
    }
    processor.on("videoReady", videoReadyListener);
    return () => {
      processor.off("videoReady", videoReadyListener);
    };
  });

  return (
    <div className="App">
      {/* need to have a visible video for mobile safari to work */}
      <video
        ref={videoRef}
        className="video-preview"
        width={10}
        height={10}
        playsInline
        muted
      />
      <canvas
        ref={previewCanvasRef}
        className="preview-canvas"
        width={videoWidth}
        height={videoHeight}
      />
      <StatsPanel
        imageCaptureTime={imageCaptureTime}
        thresholdTime={thresholdTime}
        connectedComponentTime={connectedComponentTime}
        getCornerPointsTime={getCornerPointsTime}
        extractImageTime={extractImageTime}
        extractBoxesTime={extractBoxesTime}
        ocrTime={ocrTime}
        solveTime={solveTime}
      />
      <SolutionPanel solvedPuzzle={solvedPuzzle} onStopSpeech={stopSpeech} />
    </div>
  );
}

export default App;
