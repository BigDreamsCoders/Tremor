from flask import (Flask, jsonify, render_template, request)
import joblib

app = Flask(__name__)
app.model = joblib.load('static/model.sav')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/data')
def data():
    d = str(app.model.predict([[request.args.get("date"),request.args.get("lat"), request.args.get("lng")]])).replace("[", "").replace("]","")
    print(d)
    return jsonify({"data": d})


if __name__ == '__main__':
    app.run()
