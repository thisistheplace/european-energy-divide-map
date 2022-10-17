import geojson

import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('region', type=int,
                    help='integer defining the region [0, 1, 2, 3]')
parser.add_argument('countries', type=str, nargs='*',
                    default=["DE", "DK", "FR", "ES", "PT", "SE", "NO", "CH", "FI"],
                    help='country codes defining the country to process')
args = parser.parse_args()

eurostats = Path("gpx/eurostats.json").resolve()

features: list[geojson.Feature] = []

for feature in geojson.load(open(eurostats, "r"))["features"]:
    if feature["properties"]["LEVL_CODE"] == args.region and feature["properties"]["CNTR_CODE"] in args.countries:
        features.append(feature)

collection = geojson.FeatureCollection(
    features=features,
    name=f"European Regions - NUTS {args.region}"
)

json.dump(collection, open(f"assets/eurostats_{args.region}.json", "w"))