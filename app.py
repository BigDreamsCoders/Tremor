import joblib
from flask import (Flask, jsonify, render_template, request)
import re

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
    mag = args.get("magnitude")
    depth = args.get("depth")

    d = str(
        app.modelMagnitudProfundidad.predict(
            [[timestamp, args.get('lat'), args.get('lng')]]
        )
    )


@app.route('/latitud')
def latlng():
    args = request.args
    d = str(app.modelLatitudLongitud.predict(
        [[args.get("timestamp"), args.get("magnitude"), args.get("depth")]]))
    finalString = re.sub("]", "", re.sub("\[", "", d))
    return jsonify({"data": finalString})


if __name__ == '__main__':
    app.run()
