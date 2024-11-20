import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import { createXChart, createYChart, updateXChart, updateYChart, resetCharts } from './graphing'; // Import graphing functions

const videoElement = document.getElementById('video') as HTMLVideoElement;
const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext('2d');
const startButton = document.getElementById('startButton') as HTMLButtonElement;
const stopButton = document.getElementById('stopButton') as HTMLButtonElement;

let camera: Camera | null = null;

const LEFT_IRIS_CENTER = 468;
const RIGHT_IRIS_CENTER = 473;
const LEFT_EYE_CORNER = 33;
const RIGHT_EYE_CORNER = 263;
const NOSE_TIP = 4;

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Function to get specific landmarks by indices
function getLandmarks(landmarks: any[], indices: number[]): any[] {
  return indices.map(index => landmarks[index]);
}

// Handle results from face mesh
faceMesh.onResults((results) => {
  canvasCtx!.save();
  canvasCtx!.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx!.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // Get the iris center landmarks
      const irisCenterLandmarks = getLandmarks(landmarks, [LEFT_IRIS_CENTER, RIGHT_IRIS_CENTER]);
      const eyeCornerLandmarks = getLandmarks(landmarks, [LEFT_EYE_CORNER, RIGHT_EYE_CORNER]);

      // Calculate gaze direction (pupil movement)
      const leftGazeX = irisCenterLandmarks[0].x - eyeCornerLandmarks[0].x;
      const rightGazeX = irisCenterLandmarks[1].x - eyeCornerLandmarks[1].x;
      const gazeX = (leftGazeX + rightGazeX) / 2;
      const gazeY = (irisCenterLandmarks[0].y + irisCenterLandmarks[1].y) / 2;

      // Update the X and Y charts
      updateXChart(gazeX);
      updateYChart(gazeY);

      // Draw landmarks on the canvas for visualization
      drawLandmarks(canvasCtx, irisCenterLandmarks, { color: '#FF0000', lineWidth: 1 });
      drawLandmarks(canvasCtx, eyeCornerLandmarks, { color: '#00FF00', lineWidth: 1 });
      const noseLandmarks = getLandmarks(landmarks, [NOSE_TIP]);
      drawLandmarks(canvasCtx, noseLandmarks, { color: '#0000FF', lineWidth: 1 });
    }
  }

  canvasCtx!.restore();
});

// Start button event listener
startButton.addEventListener('click', () => {
  if (!camera) {
    // Create charts when the start button is pressed
    createXChart(document.getElementById('gazeXChart') as HTMLCanvasElement);
    createYChart(document.getElementById('gazeYChart') as HTMLCanvasElement);

    camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }
});

// Stop button event listener
stopButton.addEventListener('click', () => {
  if (camera) {
    camera.stop();
    camera = null;
    canvasCtx!.clearRect(0, 0, canvasElement.width, canvasElement.height);
    resetCharts(); // Reset the charts when stopping
  }
});
