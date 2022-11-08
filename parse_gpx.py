import gpxpy
import gpxpy.gpx

import geojson

import json
from pathlib import Path
import os

root = Path("gpx").resolve()

routes: list[geojson.Feature] = []

for fname in sorted(os.listdir(root)):
    gpx_path = root / fname
    if gpx_path.suffix.lower() != ".gpx": continue
    print(fname)
    with open(gpx_path, "r") as gpx_file:
        gpx = gpxpy.parse(gpx_file)
        coords = []
        for track in gpx.tracks:
            for segment in track.segments:
                for point in segment.points:
                    coords.append([
                        point.latitude,
                        point.longitude,
                        point.elevation
                    ])
        
        routes.append(
            geojson.Feature(
                name=gpx_path.stem.split("-")[-1],
                geometry=geojson.LineString(coords)
            )
        )

collection = geojson.FeatureCollection(
    features=routes,
    name="European Divide Trail"
)

json.dump(collection, open("assets/route.json", "w"))