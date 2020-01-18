from flask import Flask
app = Flask(__name__)
from flask import json
from flask import jsonify

@app.route('/locations')
def summary():
    d = {"long": 0.11667, "lat": 52.2}
    return jsonify(d)

@app.route("/hello")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
