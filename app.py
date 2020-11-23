import csv
import math

import joblib
from flask import (Flask, jsonify, render_template, request)

app = Flask(__name__)
app.modelLatitudLongitud = joblib.load('static/LatitudLonguitud.sav')
app.modelMagnitudProfundidad = joblib.load('static/MagnitudProfundidad.sav')


class Point:
    def __init__(self, lat, lng, mag, depth):
        self.lat = lat
        self.lng = lng
        self.mag = mag
        self.depth = depth


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/magnitud')
def magdepth():
    args = request.args
    timestamp = args.get("timestamp")
    mag = int(args.get("magnitude"))
    depth = int(args.get("depth"))
    with open('static/Sismos-el-salvador.csv') as csv_file:
        data = csv.reader(csv_file, )
        first_line = True
        points = []
        for row in data:
            if not first_line:
                points.append(
                    [
                        timestamp,
                        float(row[2]),
                        float(row[3])
                    ]
                )
            else:
                first_line = False
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


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
