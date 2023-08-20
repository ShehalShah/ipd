import cv2
import mediapipe as mp

# Initialize MediaPipe Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

# Load the image
image_path = './picture.jpg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Get pose landmarks
results = pose.process(image_rgb)

if results.pose_landmarks:
    landmarks = results.pose_landmarks.landmark
    landmark_names = [
        'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
        'right_eye_inner', 'right_eye', 'right_eye_outer',
        'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
        'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
        'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
        'left_index', 'right_index', 'left_thumb', 'right_thumb',
        'left_hip', 'right_hip', 'left_knee', 'right_knee',
        'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
        'left_foot_index', 'right_foot_index'
    ]
    for i, landmark in enumerate(landmarks):
        x = landmark.x
        y = landmark.y
        z = landmark.z
        score = landmark.visibility
        name = landmark_names[i]
        print(f"{i}\n: \n{{x: {x}, y: {y}, z: {z}, score: {score}, name: '{name}'}}")

# landmarks = results.pose_landmarks.landmark
# print("Number of keypoints:", len(landmarks))
# print(dir(results))
# Display the image with landmarks
# image_with_landmarks = image.copy()
# h, w, _ = image.shape
# for landmark in landmarks:
#     x = int(landmark.x * w)
#     y = int(landmark.y * h)
#     cv2.circle(image_with_landmarks, (x, y), 5, (0, 255, 0), -1)

# cv2.imshow('Image with Landmarks', image_with_landmarks)
cv2.waitKey(0)
cv2.destroyAllWindows()
