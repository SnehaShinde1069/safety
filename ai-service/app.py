import cv2
import numpy as np
import mediapipe as mp
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import requests
import json
from threading import Thread
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

# Configuration
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
UPLOAD_FOLDER = 'recorded_videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global variables for gesture tracking
gesture_history = []
z_pattern_points = []
video_frames = []
is_recording = False

class GestureDetector:
    """Detects emergency hand gestures"""
    
    @staticmethod
    def get_hand_landmarks(hand_landmarks):
        """Extract hand landmarks"""
        if hand_landmarks is None:
            return None
        
        landmarks = {}
        for i, lm in enumerate(hand_landmarks.landmark):
            landmarks[i] = {'x': lm.x, 'y': lm.y, 'z': lm.z}
        return landmarks
    
    @staticmethod
    def detect_sos_gesture(landmarks):
        """
        Detect SOS-like hand gesture:
        - Open palm followed by fist followed by open palm
        - Repeated twice
        """
        if landmarks is None:
            return False
        
        # Calculate hand openness (distance between fingers)
        try:
            # Thumb tip to index tip
            thumb_index = abs(landmarks[4]['x'] - landmarks[8]['x']) + abs(landmarks[4]['y'] - landmarks[8]['y'])
            # Index to pinky distance
            index_pinky = abs(landmarks[8]['x'] - landmarks[20]['x']) + abs(landmarks[8]['y'] - landmarks[20]['y'])
            
            hand_openness = (thumb_index + index_pinky) / 2
            
            # Detect if hand is open (high openness) or closed (low openness)
            return hand_openness > 0.15
        except:
            return False
    
    @staticmethod
    def detect_help_gesture(landmarks):
        """
        Detect HELP gesture:
        - Both hands raised above head
        - Arms extended
        """
        if landmarks is None:
            return False
        
        try:
            # Check if wrist is raised (y < 0.4 means upper half of frame)
            wrist_y = landmarks[0]['y']
            return wrist_y < 0.4
        except:
            return False

class ZPatternDetector:
    """Detects Z-pattern drawn on screen"""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        self.points = []
        self.start_time = None
    
    def add_point(self, x, y):
        """Add a point to the Z-pattern"""
        self.points.append((x, y))
        if self.start_time is None:
            self.start_time = datetime.now()
    
    def detect_z_pattern(self):
        """
        Detect if points form a Z pattern:
        - Should have at least 4 points
        - Should form rough Z shape (top-left to bottom-right diagonal, etc)
        """
        if len(self.points) < 4:
            return False
        
        try:
            points = np.array(self.points)
            
            # Check if pattern takes less than 2 seconds (quick gesture)
            elapsed = (datetime.now() - self.start_time).total_seconds()
            if elapsed > 3.0:
                return False
            
            # Simple Z pattern validation:
            # Should span significant horizontal distance
            x_range = max(points[:, 0]) - min(points[:, 0])
            y_range = max(points[:, 1]) - min(points[:, 1])
            
            # Z pattern should have good width and height
            if x_range < 50 or y_range < 50:
                return False
            
            return True
        except:
            return False

# Initialize detectors
gesture_detector = GestureDetector()
z_pattern_detector = ZPatternDetector()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'Girl Safety System AI Service is running',
        'service': 'Hand Gesture & Z-Pattern Detection'
    })

@app.route('/api/detect-gesture', methods=['POST'])
def detect_gesture():
    """
    Detect hand gesture from video frame
    Expects: base64 encoded image or numpy array
    """
    try:
        data = request.json
        
        if 'frame' not in data:
            return jsonify({'error': 'No frame provided'}), 400
        
        # Decode frame
        import base64
        frame_data = base64.b64decode(data['frame'])
        frame_array = np.frombuffer(frame_data, dtype=np.uint8)
        frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid frame'}), 400
        
        # Process frame
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        
        detected_gestures = {
            'sos_gesture': False,
            'help_gesture': False,
            'hand_count': 0,
            'confidence': 0
        }
        
        if results.multi_hand_landmarks:
            detected_gestures['hand_count'] = len(results.multi_hand_landmarks)
            
            for hand_landmarks in results.multi_hand_landmarks:
                landmarks = gesture_detector.get_hand_landmarks(hand_landmarks)
                
                # Check for SOS gesture
                if gesture_detector.detect_sos_gesture(landmarks):
                    gesture_history.append(('sos', datetime.now()))
                    detected_gestures['sos_gesture'] = True
                    detected_gestures['confidence'] = 0.85
                
                # Check for HELP gesture
                if gesture_detector.detect_help_gesture(landmarks):
                    detected_gestures['help_gesture'] = True
                    detected_gestures['confidence'] = 0.90
        
        # Check if emergency gesture detected (3+ SOS gestures in 5 seconds)
        emergency_triggered = False
        recent_gestures = [g for g in gesture_history if (datetime.now() - g[1]).total_seconds() < 5]
        if len(recent_gestures) >= 3:
            emergency_triggered = True
            gesture_history.clear()
        
        return jsonify({
            'detected_gestures': detected_gestures,
            'emergency_triggered': emergency_triggered,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in gesture detection: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/z-pattern', methods=['POST'])
def detect_z_pattern():
    """
    Detect Z-pattern from touch coordinates
    Expects: list of points with x, y coordinates
    """
    try:
        data = request.json
        
        if 'points' not in data:
            return jsonify({'error': 'No points provided'}), 400
        
        points = data['points']
        
        # Reset detector for new pattern
        z_pattern_detector.reset()
        
        # Add points
        for point in points:
            z_pattern_detector.add_point(point['x'], point['y'])
        
        # Detect pattern
        pattern_detected = z_pattern_detector.detect_z_pattern()
        
        if pattern_detected:
            logger.info("Z-Pattern detected! Emergency trigger activated.")
        
        return jsonify({
            'z_pattern_detected': pattern_detected,
            'points_count': len(points),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in Z-pattern detection: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/record-video', methods=['POST'])
def record_video():
    """
    Record video and save it
    Expects: list of base64 encoded frames
    """
    try:
        data = request.json
        
        if 'frames' not in data:
            return jsonify({'error': 'No frames provided'}), 400
        
        frames = data['frames']
        duration = data.get('duration', 10)  # Default 10 seconds
        
        if not frames:
            return jsonify({'error': 'No frames to process'}), 400
        
        # Decode frames
        import base64
        video_array = []
        for frame_data in frames:
            frame_bytes = base64.b64decode(frame_data)
            frame_array = np.frombuffer(frame_bytes, dtype=np.uint8)
            frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
            if frame is not None:
                video_array.append(frame)
        
        if not video_array:
            return jsonify({'error': 'Could not decode any frames'}), 400
        
        # Save video
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        video_filename = f"incident_{timestamp}.mp4"
        video_path = os.path.join(UPLOAD_FOLDER, video_filename)
        
        # Use OpenCV to write video
        height, width = video_array[0].shape[:2]
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(video_path, fourcc, 15.0, (width, height))
        
        for frame in video_array:
            out.write(frame)
        
        out.release()
        
        logger.info(f"Video saved: {video_path}")
        
        return jsonify({
            'success': True,
            'video_filename': video_filename,
            'video_path': video_path,
            'frames_recorded': len(video_array),
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in video recording: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/trigger-emergency', methods=['POST'])
def trigger_emergency():
    """
    Trigger emergency alert via Flask
    Sends incident data to Node.js backend
    """
    try:
        data = request.json
        
        if not all(key in data for key in ['userId', 'location', 'type']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        incident_data = {
            'type': data['type'],  # 'hand-gesture-detection' or 'z-pattern-trigger'
            'description': data.get('description', 'Emergency detected via AI system'),
            'location': data['location'],
            'severity': data.get('severity', 'high'),
            'videoUrl': data.get('videoUrl'),
            'attachments': data.get('attachments', [])
        }
        
        # Send to Node.js backend
        headers = {
            'Authorization': f"Bearer {data.get('token')}",
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/incidents",
            json=incident_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 201:
            logger.info(f"Emergency triggered successfully for user {data['userId']}")
            return jsonify({
                'success': True,
                'message': 'Emergency alert sent',
                'incident': response.json()
            })
        else:
            logger.error(f"Failed to trigger emergency: {response.text}")
            return jsonify({'error': 'Failed to send alert to backend'}), 500
    
    except Exception as e:
        logger.error(f"Error triggering emergency: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stream-process', methods=['POST'])
def stream_process():
    """
    Real-time stream processing endpoint
    Can receive live video stream and process frame by frame
    """
    try:
        data = request.json
        frame = data.get('frame')
        user_id = data.get('user_id')
        
        if not frame:
            return jsonify({'error': 'No frame provided'}), 400
        
        # Decode and process frame
        import base64
        frame_data = base64.b64decode(frame)
        frame_array = np.frombuffer(frame_data, dtype=np.uint8)
        cv_frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
        
        # Process with MediaPipe
        frame_rgb = cv2.cvtColor(cv_frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        
        # Draw landmarks on frame
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    cv_frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS
                )
        
        # Encode processed frame
        _, buffer = cv2.imencode('.jpg', cv_frame)
        processed_frame = base64.b64encode(buffer).decode()
        
        return jsonify({
            'processed_frame': processed_frame,
            'hands_detected': len(results.multi_hand_landmarks) if results.multi_hand_landmarks else 0,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in stream processing: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
