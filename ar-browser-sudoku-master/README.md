# Sudoku Spectacles

A sophisticated browser-based application that combines computer vision, machine learning, and real-time processing to solve Sudoku puzzles through a camera feed. This project demonstrates the power of modern web technologies in handling complex computer vision tasks traditionally requiring native applications, with special integration for Ray-Ban Meta glasses.

## Technical Overview

### Core Features
- Real-time Sudoku puzzle detection and extraction from camera feed
- Optical Character Recognition (OCR) using TensorFlow.js
- Perspective correction and grid detection
- Real-time puzzle solving
- Text-to-speech feedback for solutions
- Seamless integration with Ray-Ban Meta glasses camera feed

### Architecture
The project consists of two main components:

1. **Frontend Application** (`app/`)
   - Browser-based TypeScript application
   - Real-time video processing pipeline
   - Computer vision algorithms for grid detection
   - Integration with TensorFlow.js for OCR
   - Performance-optimized Sudoku solver
   - Ray-Ban Meta glasses camera feed integration via WebRTC

2. **Machine Learning Training** (`tensorflow/`)
   - Custom neural network training pipeline
   - Training data generation and augmentation
   - Model testing and validation
   - Font-based training data generation

### Technical Stack
- **Frontend**: TypeScript, WebRTC, Canvas API
- **Computer Vision**: Custom image processing algorithms
- **Machine Learning**: TensorFlow.js, Custom CNN
- **Build Tools**: Node.js, Yarn
- **Development**: Jupyter Notebooks for ML training
- **AR Integration**: Ray-Ban Meta glasses API, WebRTC

## Key Technical Achievements
1. **Real-time Processing**
   - Optimized video frame processing pipeline
   - Efficient grid detection and perspective correction
   - Performance monitoring and optimization
   - Low-latency processing for Ray-Ban Meta glasses feed

2. **Robust Computer Vision**
   - Adaptive thresholding for varying lighting conditions
   - Connected component analysis for grid detection
   - Homographic transform for perspective correction
   - Accurate box extraction and digit recognition
   - Optimized for Ray-Ban Meta glasses camera characteristics

3. **Machine Learning Integration**
   - Custom-trained neural network for OCR
   - Font-based training data generation
   - Model optimization for browser deployment
   - Enhanced digit recognition for Ray-Ban Meta glasses feed

4. **AR Integration**
   - Seamless Ray-Ban Meta glasses camera feed integration
   - Real-time processing of video streams
   - Optimized for Ray-Ban Meta glasses display characteristics
   - Text-to-speech feedback for hands-free operation

## Getting Started

### Prerequisites
- Node.js
- Yarn
- Python 3 (for ML training)
- Modern web browser with WebRTC support
- Ray-Ban Meta glasses
- WhatsApp Desktop application
- Smartphone with WhatsApp installed

### Setting Up Ray-Ban Meta Glasses Integration
1. **Initial Setup**
   - Install WhatsApp Desktop on your computer
   - Ensure your smartphone is connected to your Ray-Ban Meta glasses
   - Open WhatsApp Desktop and log in to your account

2. **Camera Feed Setup**
   - Start a video call from WhatsApp Desktop to your smartphone
   - Once connected, double-click the button on your Ray-Ban Meta glasses to activate the camera feed
   - The live feed will now be coming from the glasses' camera (located on the left side)

3. **Running the Application**
   ```bash
   cd app
   yarn
   yarn start
   ```

4. **Using the Application**
   - When prompted, select the WhatsApp Desktop application window as the video source
   - Position the Sudoku puzzle in view of the glasses' camera
   - Keep in mind that the camera is on the left side of the glasses
   - The application will automatically detect and solve the puzzle
   - Solutions will be read aloud through text-to-speech

For local development with Ray-Ban Meta glasses, use `ngrok` to proxy HTTPS connections:
```bash
ngrok http 3000
```

### Building for Production
```bash
yarn build
```

## Machine Learning Training
The application includes a pretrained network, but you can train your own model:

```bash
cd tensorflow
python3 -m venv venv
. ./venv/bin/activate
pip install -r requirements.txt
```

### Training Pipeline
1. Unzip fonts in `tensorflow/fonts` and run `list.sh`
2. Run Jupyter notebooks:
   - `train.ipynb`: Model training
   - `test-model.ipynb`: Model evaluation
   - `generate_training_data.ipynb`: Training data generation

## Performance Considerations
- Optimized for real-time processing with Ray-Ban Meta glasses
- Efficient memory management for mobile devices
- Browser-compatible ML model
- Responsive UI design
- Low-latency processing for AR experience
- Camera position awareness (left-side mounted)

## License
This project is licensed under the terms specified in the LICENSE file.
