import joblib
from flask import (Flask, jsonify, render_template, request)

app = Flask(__name__)
app.model = joblib.load('static/MagnitudProfundidad.sav')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data')
def data():
    d = str(app.model.predict([[request.args.get("date"), request.args.get("lat"), request.args.get("lng")]])).replace(
        "[", "").replace("]", "")
    return jsonify({"data": d})


if __name__ == '__main__':
    app.run()
