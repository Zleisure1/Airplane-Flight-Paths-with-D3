
import sys
from flask import Flask, render_template, jsonify, redirect
import pymongo
import scrape_mars

sys.setrecursionlimit(2000)
app = Flask(__name__)


client = pymongo.MongoClient()
db = client.mars_db
collection = db.mars_facts



@app.route('/scrape')
def scrape():
   # db.collection.remove()
    mars = scrape_mars.scrape()
    print("\n\n\n")
    #print(mars)
    #mars = {'news_title': "NASA's Next Mars Lander Spreads its Solar Wings", 'news_paragraph': "NASA's next mission to Mars passed a key test Tuesday, extending the solar arrays that will power the InSight spacecraft once it lands on the Red Planet this November.", 'featured_image': 'https://www.jpl.nasa.gov//spaceimages/images/largesize/PIA20318_hires.jpg', 'mars_weather': 'Sol 1945 (Jan 25, 2018), Sunny, high -22C/-7F, low -78C/-108F, pressure at 7.51 hPa, daylight 05:43-17:28', 'hemisphere_img_url': [{'image title': 'Cerberus Hemisphere Enhanced', 'image url': 'https://astrogeology.usgs.gov//cache/images/cfa62af2557222a02478f1fcd781d445_cerberus_enhanced.tif_full.jpg'}, {'image title': 'Schiaparelli Hemisphere Enhanced', 'image url': 'https://astrogeology.usgs.gov//cache/images/3cdd1cbf5e0813bba925c9030d13b62e_schiaparelli_enhanced.tif_full.jpg'}, {'image title': 'Syrtis Major Hemisphere Enhanced', 'image url': 'https://astrogeology.usgs.gov//cache/images/ae209b4e408bb6c3e67b6af38168cf28_syrtis_major_enhanced.tif_full.jpg'}, {'image title': 'Valles Marineris Hemisphere Enhanced', 'image url': 'https://astrogeology.usgs.gov//cache/images/ae209b4e408bb6c3e67b6af38168cf28_syrtis_major_enhanced.tif_full.jpg'}]}
    db.mars_facts.insert_one(mars)
    return "Some scrapped data"

@app.route("/")
def home():
    mars = list(db.mars_facts.find())
    print(mars)
    return render_template("index.html", mars = mars)


if __name__ == "__main__":
    app.run(debug=True)


