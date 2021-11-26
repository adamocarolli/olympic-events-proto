import {LEX_VALUE_TYPES} from './lex';

const countryCountReducer = ([counter, maxCount]: [{[key: string]: number}, number], event): [
  {[key: string]: number}, // Counter of events with a particular ISO code
  number
] => {
  if (!counter.hasOwnProperty(event.ISO)) counter[event.ISO] = 0;
  ++counter[event.ISO];
  maxCount = Math.max(counter[event.ISO], maxCount)
  return [counter, maxCount];
}

// NOTE: To simplify this project we've loaded the olympic athlete events dataset
//       in the browser and are running aggregation and filter queries client-side,
//       however, this isn't ideal as the dataset continues to grow as olympic games go on.
//       My suggestion would be to use a database such as PostgreSQL or ElasticSearch to
//       asynchronously run these queries from a server.
//       To do this you'd need to convert the filters into a string and send it in the
//       API call, your server would then need to generate the appropriate database query
//       from that string and back the results.
export const runQuery = (countriesGeoFeatures, athleteEvents, filters) => {
  const [filteredMap, maxCount] = athleteEvents.filter(d => {
    let passFilter = true;
    for (const filter of filters) {
      const field = filter.field.key;
      const type = filter.field.meta.type;
      const relation = filter.relation.key;
      let value = filter.value.key;

      if (type === LEX_VALUE_TYPES.NUMERIC) {
        value = Number(value);
        if (relation === 'equals') {
          // TODO: Enable Autotype-inference on JSON ingestion
          passFilter &&= Number(d[field]) === value;
        }
      }
    }
    return passFilter;
  }).reduce(countryCountReducer, [{}, 0]);

  // Calculate geo feature counts
  return countriesGeoFeatures.features.filter(feature => {
    if (filteredMap.hasOwnProperty(feature.properties.ISO_A3)) {
      feature.properties.interpolation = filteredMap[feature.properties.ISO_A3] / maxCount;
      return true;
    }
  });
}
