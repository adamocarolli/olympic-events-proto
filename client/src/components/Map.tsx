import React from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {scaleThreshold} from 'd3-scale';

// TODO: Enable rotation of Mapbox Public access token and store token in environment variable as suggested here
//       (https://docs.mapbox.com/help/troubleshooting/how-to-use-mapbox-securely/) for this project we've created
//       a burner token that will be deleted within a week.
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWNhcm9sbGkiLCJhIjoiY2tiNXRvb21qMThrejMxbXR0YWlmeG90aCJ9.uLXpQM0cpg_XJCGCrNospA';
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
const COLOR_SCALE = scaleThreshold()
  .domain([0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
  .range([
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ]);
const INITIAL_VIEW_STATE = {
  latitude: 0,
  longitude: 0,
  zoom: 2,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};
const MAX_ELEVATION = 1000000;

// TODO: There is a bug where the tooltip is rendered off the screen when a user hovers over a country
//       near the right edge of the screen. Add position logic to keep the tooltip on the screen.
function getTooltip({object}) {
  return (
    object && {
      html: `\
        <div><b>${object.properties.ADMIN}</b></div>
        `
    }
  );
}

export default function Map({geoJsonLayerData, mapStyle = MAP_STYLE}) {
  const layers = [
    new GeoJsonLayer({
      id: 'geojson',
      data: geoJsonLayerData,
      opacity: 0.8,
      stroked: true,
      filled: true,
      wireframe: true,
      // NOTE: Uncomment these properties (`extruded`, `getElevation`) to enable a 3D map view where
      //       the elevation of a country is a visual indicator of it's event count.
      // TODO: Add a toggle button on the UI that allows a user to switch between 2D and 3D views.
      // extruded: true,
      // getElevation: f => MAX_ELEVATION * f.properties.interpolation,
      getFillColor: f => COLOR_SCALE(f.properties.interpolation),
      getLineColor: [0, 0, 0],
      getLineWidth: 5000,
      pickable: true
    })
  ];

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <StaticMap
        reuseMaps
        mapStyle={mapStyle}
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAPBOX_TOKEN} />
    </DeckGL>
  );
}
