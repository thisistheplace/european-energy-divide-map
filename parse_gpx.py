import gpxpy
import gpxpy.gpx

import json
from pathlib import Path
from pydantic import BaseModel
import os

class TrackPoint(BaseModel):
    latitude: float = ...
    longitude: float = ...
    elevation: float = ...

root = Path("gpx").resolve()

points: list[TrackPoint] = []
for fname in sorted(os.listdir(root)):
    gpx_path = root / fname
    print(fname)
    with open(gpx_path, "r") as gpx_file:
        gpx = gpxpy.parse(gpx_file)
        for track in gpx.tracks:
            for segment in track.segments:
                for point in segment.points:
                    points.append(
                        TrackPoint(
                            latitude=point.latitude,
                            longitude=point.longitude,
                            elevation=point.elevation
                        )
                    )

json.dump([pnt.dict() for pnt in points], open("assets/route.json", "w"))