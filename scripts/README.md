# Scripts
These scripts were hastily written in order to quickly start working with properly formatted datasets. Please do not look at them for inspiration.

## Geometry Pipeline
To enable rendering of geographic polygons of countries on a map we enriched the Olympic Athlete Events dataset (https://www.kaggle.com/samruddhim/olympics-althlete-events-analysis)
with two open source geographic datasets:
1. `itu_countries.csv` which contains mappings from National Olympic Committee Country Codes (NOC) to International Organization for Standardization Country Codes (ISO). This dataset is found here: https://gist.github.com/seanmangar/e96617afc446b22cf4b15eb9e1a8cc13
2. `countries_geo.json` which contains geographic polygons of each country in the world in geojson format. See: https://geojson.org/ for geojson specification. This dataset can be found here: https://www.naturalearthdata.com/downloads/

- TODO: Write output format correctness tests.
- TODO: Improve pipeline efficiency via reading to multiple workers and reading/writing in batches.
        Although for files of this size that are only processed once this TODO is likely overkill.

### Instructions
Ensure that Python 3 has been installed on your system. Then run:

```
python3 add_geometry_pipeline.py
```

- NOTE: I found that it was quicker and easier to load a gzipped JSON file over network then a CSV file, as such I used `jq` and the `csvToJson` command line tool to convert `athlete_events.csv` to `athlete_events.json`.
- TODO: Add instructions for using `csvToJson` and `jq`. Alternatively, modify python pipeline to output json file.
