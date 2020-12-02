from dotenv import load_dotenv

import csv
import math
import joblib
from flask import (Flask, jsonify, render_template, request)
from src.database import getSismosPointsWithinBoundaries, getAllSismosPoints

app = Flask(__name__)
app.modelLatitudLongitud = joblib.load('static/LatitudLonguitud.sav')
app.modelMagnitudProfundidad = joblib.load('static/MagnitudProfundidad.sav')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/magnitud')
def magdepth():
    args = request.args
    timestamp = args.get("timestamp")
    mag = int(args.get("magnitude"))
    depth = int(args.get("depth"))
    points = getAllSismosPoints(timestamp)
    response = []
    magdepth = app.modelMagnitudProfundidad.predict(
        points
    )
    for i, magdepth in enumerate(magdepth):
        if math.floor(magdepth[0]) == mag and (
                math.floor(magdepth[1]) <= depth + 5 and math.floor(magdepth[1] >= depth - 5)):
            response.append({
                "lat": points[i][1],
                "lng": points[i][2],
                "mag": magdepth[0],
                "depth": magdepth[1]
            })
    return jsonify(response)


@app.route('/latitud')
def latlng():
    args = request.args
    d = app.modelLatitudLongitud.predict(
        [[args.get("timestamp"), args.get("magnitude"), args.get("depth")]]
    )
    return jsonify([d[0][0], d[0][1]])

@app.route('/heat-points')
def sismosWithinBoundaries():
    data = getSismosPointsWithinBoundaries()
    return jsonify(data)


if __name__ == '__main__':
    app.modelLatitudLongitud = joblib.load('static/LatitudLonguitud.sav')
    app.modelMagnitudProfundidad = joblib.load('static/MagnitudProfundidad.sav')
    load_dotenv()
    app.run(debug=True,host='0.0.0.0')
