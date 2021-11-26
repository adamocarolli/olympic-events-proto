import csv
import json

def get_noc_to_iso_dict(filepath):
    noc_to_iso_dict = {}
    with open(filepath, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                print(f'Column names are {", ".join(row)}')
                line_count += 1
            noc_to_iso_dict[row['NOC_A3']] = row['ISO_A3']
            line_count += 1
        print(f'Processed {line_count} lines.')
    return noc_to_iso_dict

def get_iso_to_feature_dict(filepath):
    iso_to_feature_dict = {}
    with open(filepath, mode='r') as json_file:
        features = json.load(json_file)['features']
        for feature in features:
            iso_to_feature_dict[feature['properties']['ISO_A3']] = feature
    return iso_to_feature_dict

def process(in_filepath, out_filepath, noc_to_iso_dict, iso_to_feature_dict):
    with open(out_filepath, 'w') as f2:
        with open(in_filepath, mode='r') as infile:
            csv_reader = csv.DictReader(infile)
            line_count = 0
            writer = csv.DictWriter(f2, fieldnames=["ID","Name","Sex","Age","Height","Weight","Team","NOC","Games","Year","Season","City","Sport","Event","Medal","ISO"])
            writer.writeheader()
            for row in csv_reader:
                line_count += 1
                if line_count % 10000 == 0:
                    print(line_count)
                if not row['NOC'] in noc_to_iso_dict:
                    continue
                ISO = noc_to_iso_dict[row['NOC']]
                if not ISO in iso_to_feature_dict:
                    continue
                row['ISO'] = ISO
                writer.writerow(row)

noc_to_iso_dict = get_noc_to_iso_dict('data/itu_countries.csv')
iso_to_feature_dict = get_iso_to_feature_dict('data/countries_geo.json')
process('data/athlete_events.csv', 'output/athlete_events.csv', noc_to_iso_dict, iso_to_feature_dict)
