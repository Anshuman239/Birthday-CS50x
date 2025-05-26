from cs50 import SQL
from re import fullmatch, ASCII
from flask import Flask, redirect, render_template, request, make_response
from datetime import date

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///birthdays.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Todo-Add the user's entry into the database
        name = request.form.get("submit_name")
        day = request.form.get("sumbit_date")
        month = request.form.get("submit_month")
        year = request.form.get("submit_year")

        # check of any null value
        if name and day and month and year:
            # check the validity of form values name - a-zA-Z and space chars
            # day month and year only 0-9 ASCII chars
            if fullmatch(r'\d+', day, flags=ASCII) and fullmatch(r'\d+', month, flags=ASCII) and fullmatch(r'[a-zA-Z ]+', name) and fullmatch(r'\d+', year, flags=ASCII):
                try:
                    # check validity of date. like 29 feb in none leap year or 31 in april etc
                    date(int(year), int(month), int(day))
                    db.execute("INSERT INTO birthdays (name, day, month) VALUES(?, ?, ?)",
                               name, day, month)
                except:
                    return redirect("/")

        return redirect("/")

    else:

        # Todo-Display the entries in the database on index.html
        bdays = db.execute("SELECT * FROM birthdays")
        return render_template("index.html", bdays=bdays)


@app.route("/delete", methods=["GET"])
def deleteEntry():
    id = request.args.get("id")
    # check id is only ASCII 0-9
    if fullmatch(r'\d+', id, flags=ASCII):
        db.execute("DELETE FROM birthdays WHERE id=?", id)
        return make_response('Item deleted sucessfully', 204)
    return make_response('Some error occoured', 400)
