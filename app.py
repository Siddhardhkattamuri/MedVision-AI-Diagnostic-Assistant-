import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io

# Initialize Flask app
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
# This is crucial to allow your React app (running on a different port) to send requests to the backend
CORS(app)

# --- LOAD YOUR TRAINED MODEL ---
# Make sure the model file 'hybrid_model.h5' is in the same directory as this script
MODEL_PATH = 'vgg16_advanced_best_model.keras'
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None # Set model to None if loading fails

# Define the labels for your classes
# IMPORTANT: The order must match the output of your model's prediction
CLASS_NAMES = ["Normal", "Pneumonia", "Tuberculosis"]

# --- IMAGE PREPROCESSING ---
# This function must resize and format the image EXACTLY as you did during training
def preprocess_image(image_bytes):
    # Target image size for your model (e.g., 224x224)
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    
    # Convert image to numpy array and normalize if needed
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) # Create a batch

    # If you normalized your training data (e.g., divided by 255.0), do it here too
    img_array = img_array / 255.0
    
    return img_array

# --- DEFINE THE PREDICTION API ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        try:
            # Read image as bytes
            image_bytes = file.read()
            
            # Preprocess the image
            processed_image = preprocess_image(image_bytes)
            
            # Get model prediction
            prediction = model.predict(processed_image)
            
            # Get the confidence score and the predicted class index
            confidence = float(np.max(prediction))
            predicted_class_index = int(np.argmax(prediction))
            predicted_class_name = CLASS_NAMES[predicted_class_index]
            
            # Return the result as JSON
            return jsonify({
                "class": predicted_class_name,
                "confidence": confidence
            })
            
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return jsonify({"error": "Invalid request"}), 400


# Run the app
if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible on your local network
    app.run(host='0.0.0.0', port=5000, debug=True)