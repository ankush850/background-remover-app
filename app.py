import os
import uuid
from flask import Flask, request, send_from_directory, jsonify, render_template
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/remove-background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Create a unique filename
            filename = str(uuid.uuid4()) + ".png"
            input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            output_path = os.path.join(app.config['RESULTS_FOLDER'], filename)
            
            # Save original (optional, but good for debugging)
            # file.save(input_path)
            
            # Process image directly from stream
            input_image = Image.open(file.stream)
            
            # Convert to RGBA if not already
            if input_image.mode != 'RGBA':
                input_image = input_image.convert('RGBA')
            
            # Remove background
            output_image = remove(input_image)
            
            # Save output
            output_image.save(output_path, 'PNG')
            
            return jsonify({
                'success': True,
                'image_url': f'/results/{filename}',
                'original_filename': file.filename
            })
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return jsonify({'error': 'Failed to process image'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/results/<filename>')
def get_result(filename):
    return send_from_directory(app.config['RESULTS_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
