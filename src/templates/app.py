# # app.py
# from flask import Flask, render_template, Response
# import cv2

# app = Flask(__name__)

# # Video capture object
# video_capture = cv2.VideoCapture()

# def generate_frames():
#     while True:
#         success, frame = video_capture.read()
#         if not success:
#             break
#         else:
#             ret, buffer = cv2.imencode('.jpg', frame)
#             frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                 b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/control/<action>')
# def control(action):
#     if action == 'play':
#         video_capture.open("your_rtsp_url_here")  # Replace with your RTSP URL
#     elif action == 'pause':
#         video_capture.release()
#     return "OK"

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://Satyam:DtgwbcblfuekTDQ6@cluster0.engobf0.mongodb.net/'

try:
    mongo = PyMongo(app)
    if mongo.db:
        overlays_collection = mongo.db.overlays
        settings_collection = mongo.db.settings
    else:
        raise Exception("MongoDB connection failed")
except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")
    overlays_collection = None
    settings_collection = None

# Sample route to add an overlay
@app.route('/api/overlay', methods=['POST'])
def add_overlay():
    if overlays_collection is None:
        return jsonify({"error": "Failed to connect to MongoDB"}), 500

    try:
        overlay_data = request.get_json()
        overlays_collection.insert_one(overlay_data)
        return jsonify({"message": "Overlay added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sample route to get all overlays
@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    if overlays_collection is None:
        return jsonify({"error": "Failed to connect to MongoDB"}), 500

    try:
        overlays = list(overlays_collection.find())
        return jsonify(overlays), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sample route to add a setting
@app.route('/api/settings', methods=['POST'])
def add_setting():
    if settings_collection is None:
        return jsonify({"error": "Failed to connect to MongoDB"}), 500

    try:
        setting_data = request.get_json()
        settings_collection.insert_one(setting_data)
        return jsonify({"message": "Setting added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sample route to get all settings
@app.route('/api/settings', methods=['GET'])
def get_settings():
    if settings_collection is None:
        return jsonify({"error": "Failed to connect to MongoDB"}), 500

    try:
        settings = list(settings_collection.find())
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
