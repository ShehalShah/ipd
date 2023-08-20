import cv2
import os
import numpy as np
import mediapipe as mp
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Initialize MediaPipe Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

# Function to extract pose keypoints from an image
def extract_keypoints(image_path):
    image = cv2.imread(image_path)
    
    if image is None:
        print(f"Error loading image: {image_path}")
        return None
    
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    if results.pose_landmarks:
        return [landmark.x for landmark in results.pose_landmarks.landmark] + [landmark.y for landmark in results.pose_landmarks.landmark]
    else:
        return None

# Set the paths to your image folders
posture_types = ['slouch', 'headforward', 'tilting', 'shoulders', 'leaning', 'normal']
data_dir = './posturetypes'

# Create dataset
data = []
labels = []

for i, posture in enumerate(posture_types):
    posture_dir = os.path.join(data_dir, posture)
    for image_file in os.listdir(posture_dir):
        if image_file.endswith('.jpg') or image_file.endswith('.png'): 
            image_path = os.path.join(posture_dir, image_file)
            keypoints = extract_keypoints(image_path)
            if keypoints:
                data.append(keypoints)
                labels.append(i)

# Convert to numpy arrays
X = np.array(data)
y = np.array(labels)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model using Gradient Boosted Trees
clf = GradientBoostingClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Make predictions on the test set
y_pred = clf.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# Image to test
# test_image_path = './pic2.jpg'
# test_keypoints = extract_keypoints(test_image_path)

# if test_keypoints:
#     # Predict the posture label for the test image
#     predicted_label = clf.predict([test_keypoints])[0]
#     predicted_posture = posture_types[predicted_label]
#     print("Predicted Posture:", predicted_posture)
# else:
#     print("No pose keypoints detected in the test image.")

cv2.waitKey(0)
cv2.destroyAllWindows()
