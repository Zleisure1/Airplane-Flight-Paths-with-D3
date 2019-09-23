# 1. import Flask
from flask import Flask

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)


# 3. Define what to do when a user hits the index route
@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    return "Welcome to my 'Home' page!"


# 4. Define what to do when a user hits the /about route

@app.route("/")
def home():
    print("This is our project of airline routes)
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)


