from flask import Flask, request, jsonify
import cv2
import joblib
import numpy as np
import mediapipe as mp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='*', resources='*')


# Initialize MediaPipe Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

# Load the trained model
model_filename = 'posture_classifier_model.pkl'
loaded_model = joblib.load(model_filename)

# List of posture types
posture_types = ['slouch', 'headforward', 'tilting', 'shoulders', 'leaning', 'normal']

# Function to extract pose keypoints from an image
def extract_keypoints(image):
    if image is None:
        return None
    
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    if results.pose_landmarks:
        return [landmark.x for landmark in results.pose_landmarks.landmark] + [landmark.y for landmark in results.pose_landmarks.landmark]
    else:
        return None

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict_posture():
    if request.method == 'OPTIONS':
        response = app.response_class()
        response.headers.add('Access-Control-Allow-Headers', 'content-type')
        return response
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image'].read()
    image = np.fromstring(image, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    
    keypoints = extract_keypoints(image)
    
    if keypoints:
        predicted_label = loaded_model.predict([keypoints])[0]
        predicted_posture = posture_types[predicted_label]
        return jsonify({'predicted_posture': predicted_posture})
    else:
        return jsonify({'error': 'No pose keypoints detected'}), 400
        # print("heloo error")

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong'})


if __name__ == '__main__':
    app.run(debug=True,port=5001)


# import asyncio
# import cv2
# import numpy as np
# import joblib
# import mediapipe as mp
# import websockets

# # Initialize MediaPipe Pose model
# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=True)

# # Load the trained model
# model_filename = 'posture_classifier_model.pkl'
# loaded_model = joblib.load(model_filename)

# # List of posture types
# posture_types = ['slouch', 'headforward', 'tilting', 'shoulders', 'leaning', 'normal']

# async def predict_posture(websocket, path):
#     try:
#         while True:
#             # Receive base64-encoded image frame from the client
#             image_data = await websocket.recv()
            
#             # Decode the image data and convert to a NumPy array
#             image_bytes = base64.b64decode(image_data)
#             image_np = np.frombuffer(image_bytes, dtype=np.uint8)
#             image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            
#             keypoints = extract_keypoints(image)
            
#             if keypoints:
#                 predicted_label = loaded_model.predict([keypoints])[0]
#                 predicted_posture = posture_types[predicted_label]
#                 await websocket.send(predicted_posture)
#             else:
#                 await websocket.send('No pose keypoints detected')
#     except websockets.exceptions.ConnectionClosed:
#         pass

# if __name__ == '__main__':
#     start_server = websockets.serve(predict_posture, 'localhost', 8765)
#     asyncio.get_event_loop().run_until_complete(start_server)
#     asyncio.get_event_loop().run_forever()


# from flask import Flask, request, jsonify
# import cv2
# import joblib
# import numpy as np
# import mediapipe as mp
# from flask_cors import CORS
# from flask_socketio import SocketIO

# app = Flask(__name__)
# CORS(app, supports_credentials=True)  # Enable CORS with credentials
# socketio = SocketIO(app, cors_allowed_origins="*")

# # Initialize MediaPipe Pose model
# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=True)

# # Load the trained model
# model_filename = 'posture_classifier_model.pkl'
# loaded_model = joblib.load(model_filename)

# # List of posture types
# posture_types = ['slouch', 'headforward', 'tilting', 'shoulders', 'leaning', 'normal']

# # Function to extract pose keypoints from an image
# def extract_keypoints(image):
#     if image is None:
#         return None
    
#     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     results = pose.process(image_rgb)
    
#     if results.pose_landmarks:
#         return [landmark.x for landmark in results.pose_landmarks.landmark] + [landmark.y for landmark in results.pose_landmarks.landmark]
#     else:
#         return None

# @socketio.on('image')
# def handle_image(image_data):
#     # Convert base64-encoded image data to NumPy array
#     image_bytes = base64.b64decode(image_data)
#     image_np = np.frombuffer(image_bytes, dtype=np.uint8)
#     image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
    
#     keypoints = extract_keypoints(image)
    
#     if keypoints:
#         predicted_label = loaded_model.predict([keypoints])[0]
#         predicted_posture = posture_types[predicted_label]
#         socketio.emit('predicted_posture', predicted_posture)
#     else:
#         socketio.emit('predicted_posture', 'No pose keypoints detected')

# if __name__ == '__main__':
#     socketio.run(app, debug=True)
