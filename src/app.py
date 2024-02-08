from flask import Flask, request, jsonify
from flask_cors import CORS  # to avoid cors error in different frontend like react js or any other
from models import video # call model file
app = Flask(__name__)
CORS(app)
import datetime

video= video.Video()

# video routes
@app.route('/video', methods=['GET'])
def get_tasks():
    return jsonify(video.find({})), 200


@app.route('/video/<string:video_id>/', methods=['GET'])
def get_task(video_id):
    return video.find_by_id(video_id), 200



@app.route('/video', methods=['POST'])
def add_tasks():
    if request.method == "POST":
        # print(request)
        text = request.form['text']
        position = request.form['position']
        fontSize= request.form['fontSize']
        response = video.create({'text': text , 'position': position, 'size':fontSize})
        return response, 201

@app.route('/video/<string:video_id>/', methods=['PUT'])
def update_tasks(video_id):
    if request.method == "PUT":
        text = request.form['text']
        position = request.form['position']
        fontSize= request.form['fontSize']

        response = video.update(video_id, {'text': text , 'position': position, 'size':fontSize})
        return response, 201


@app.route('/video/<string:video_id>/', methods=['DELETE'])
def delete_tasks(video_id):
    if request.method == "DELETE":
        video.delete(video_id)
        return "Record Deleted"


if __name__ == '__main__':
    app.run(debug=True)
