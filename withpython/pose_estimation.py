import cv2
import mediapipe as mp
import time

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# For webcam input:
cap = cv2.VideoCapture(0)

# Initialize the Pose Estimation model
with mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as pose:

    prevTime = 0  # Initialize prevTime here

    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # Convert the BGR image to RGB.
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        # Check if landmarks are detected
        if results.pose_landmarks:
            # Get the keypoints' coordinates
            keypoints = results.pose_landmarks.landmark

            # Iterate through keypoints and print their coordinates
            for idx, landmark in enumerate(keypoints):
                height, width, _ = image.shape
                x, y = int(landmark.x * width), int(landmark.y * height)
                print(f"Keypoint {idx}: ({x}, {y})")

        # Draw the pose annotation on the image.
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        currTime = time.time()
        fps = 1 / (currTime - prevTime)
        prevTime = currTime
        cv2.putText(image, f'FPS: {int(fps)}', (20, 70), cv2.FONT_HERSHEY_PLAIN, 3, (0, 196, 255), 2)
        cv2.imshow('Pose Estimation', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
