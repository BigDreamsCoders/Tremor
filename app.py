from flask import (Flask, jsonify, render_template)
import joblib

app = Flask(__name__)
app.model = joblib.load('static/model.sav')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/data')
def data():
    d = str(app.model.predict([[1, 1, 1]])).replace("[", "").replace("]","")
    return jsonify({"data": d})


if __name__ == '__main__':
    app.run()
