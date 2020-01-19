from flask import Flask
from flask import jsonify, request, json
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("keys/firebase.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
barcodes_ref = db.collection('barcodes')
bins_ref = db.collection('bins')
full_ref = db.collection('full')

app = Flask(__name__)
CORS(app)

@app.route('/locations')
def locations():
    d = [{"lat":52.20506323635333,"lng":0.1201924681663513},{"lat":52.20548978938501, "lng":0.11858213692903519},{"lat":52.204643459791335, "lng":0.11828273534774782},{"lat":52.20623686373032,"lng":0.11941663920879363},{"lat":52.20379403194475,"lng":0.12135755270719527},{"lat":52.20324561429087, "lng":0.11907096952199936}] 
    return jsonify(d)

@app.route('/fullLocations')
def fullLocations():
    try:
        full_bin_ids = [bin_id.id for bin_id in full_ref.stream()]
        bins = [[bin.id, bin.to_dict()] for bin in bins_ref.stream()]
        full_bins = [b[1] for b in bins if (b[0] in full_bin_ids)]
        return jsonify(full_bins), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route("/hello")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

@app.route("/full")
def full():
    try:
        id = request.args.get('id')
        if id:
            full_ref.document(id).set("")
            return "", 200
        else:
            return jsonify([bin_id.id for bin_id in full_ref.stream()]), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route("/empty")
def empty():
    try:
        id = request.args.get('id')
        if id:
            full_ref.document(id).delete()
            return "", 200
        else:
            return jsonify([bin_id.id for bin_id in full_ref.stream()]), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route("/barcodes")
def barcodes():
    try:
        # Check if barcode was passed to URL query
        barcode = request.args.get('barcode')
        if barcode:
            products = barcodes_ref.where('barcode', '==', barcode).stream()
            all_products = [prod.to_dict() for prod in products]
            return jsonify(all_products), 200
        else:
            all_products = [prod.to_dict() for prod in barcodes_ref.stream()]
            return jsonify(all_products), 200
    except Exception as e:
        return f"An Error Occured: {e}"

if __name__ == "__main__":
    app.run(host='0.0.0.0', threaded=True)
