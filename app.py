from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

alarm_time = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/time")
def get_time():
    now = datetime.now()
    return jsonify({
        "hour": now.strftime("%H"),
        "minute": now.strftime("%M"),
        "second": now.strftime("%S"),
        "pal": int(now.microsecond / 10000),
        "date": now.strftime("%d-%m-%Y"),
        "year": now.strftime("%Y")
    })

@app.route("/set_alarm", methods=["POST"])
def set_alarm():
    global alarm_time
    alarm_time = request.json.get("alarm")
    return jsonify({"status": "Alarm Set", "alarm": alarm_time})

@app.route("/check_alarm")
def check_alarm():
    if alarm_time:
        now = datetime.now().strftime("%H:%M")
        if now == alarm_time:
            return jsonify({"ring": True})
    return jsonify({"ring": False})

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
