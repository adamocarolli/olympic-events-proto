import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAsync } from "react-async";

import Map from './components/Map';
import SearchBar from './components/SearchBar';
import { runQuery } from './utils/query-engine';
import {loadRemoteJsonData} from './utils/data';
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min';
import '@uncharted.software/lex/dist/lex.css';

const ATHLETE_EVENTS_DATASET_URL = 'https://raw.githubusercontent.com/adamocarolli/olympic-events-proto/main/data/athlete_events.json';
const COUNTRIES_GEOJSON_DATASET_URL = 'https://raw.githubusercontent.com/adamocarolli/olympic-events-proto/main/data/countries_geo.json';

function App() {
  const [filters, setFilters] = useState([]);
  let athleteEvents;
  let countriesGeoFeatures;
  // NOTE: Here we load the athlete events data into the client, while useful for a quick demo,
  //       this is not a scalable approach and causes slow network loading times (2-4 seconds on my connection pre-cache)
  //       along with possible memory/CPU issues depending on the users device.
  //       See the `query-engine.ts` utility file for a description of a server-side approach.
  const { data } = useAsync({
    promiseFn: loadRemoteJsonData,
    urls: [
      ATHLETE_EVENTS_DATASET_URL,
      COUNTRIES_GEOJSON_DATASET_URL,
    ]
  });
  if (data) {
    athleteEvents = data[0];
    countriesGeoFeatures = data[1];
  }

  // NOTE: Build a GeoJSON object containing geographic polygons of each country. Filter
  //       countries that are not returned by the query. For countries returned by the
  //       the query set the interpolation value (between 0-1) as a property
  //       to generate the countries gradient value on the map.
  //       See https://geojson.org/ for specification details.
  let countryGeoFeatures = [];
  if (athleteEvents && countriesGeoFeatures) {
    countryGeoFeatures = runQuery(countriesGeoFeatures, athleteEvents, filters);
  }
  const geoJsonLayerData = {
    type: 'FeatureCollection',
    features: countryGeoFeatures,
  };

  return (
    <div className="App">
      <SearchBar setFilters={setFilters} />
      <Map geoJsonLayerData={ geoJsonLayerData } />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
