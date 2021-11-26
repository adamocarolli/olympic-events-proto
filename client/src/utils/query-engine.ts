import { filterTransformDependencies } from 'mathjs';
import {LEX_VALUE_TYPES, LEX_RELATIONSHIP_TYPES} from './lex';

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
//       from that string and back the results. You'd also need to pre-load the dataset into
//       the database.
export const runQuery = (countriesGeoFeatures, athleteEvents, filters) => {
  console.log(filters);
  for (const filter of filters) {
    const relation = filter.relation.key;
  }
  const [filteredMap, maxCount] = athleteEvents.filter(d => {
    let passFilter = true;
    for (const filter of filters) {
      const field = filter.field.key;
      const type = filter.field.meta.type;
      const relation = filter.relation.key;
      let value = filter.value.key;
      let secondaryValue = filter.secondaryValue?.key;

      if (type === LEX_VALUE_TYPES.NUMERIC) {
        value = Number(value);
        if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.NUMERIC].EQUALS) {
          // TODO: Enable Autotype-inference on JSON ingestion
          passFilter &&= Number(d[field]) === value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.NUMERIC].DOES_NOT_EQUAL) {
          passFilter &&= Number(d[field]) !== value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.NUMERIC].LESS_THAN) {
          passFilter &&= Number(d[field]) < value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.NUMERIC].GREATER_THAN) {
          passFilter &&= Number(d[field]) > value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.NUMERIC].BETWEEN) {
          secondaryValue = Number(secondaryValue);
          passFilter &&= value < Number(d[field]) && Number(d[field]) < secondaryValue;
        }
      } else if (type === LEX_VALUE_TYPES.STRING) {
        if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.STRING].IS) {
          passFilter &&= d[field] === value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.STRING].IS_NOT) {
          passFilter &&= d[field] !== value;
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.STRING].IS_LIKE) {
          // TODO: Differentiate between IS_LIKE and CONTAINS and provide users a guide on
          //       the difference. Consider changing naming to be more clear.
          passFilter &&= d[field].includes(value);
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.STRING].CONTAINS) {
          passFilter &&= d[field].includes(value);
        } else if (relation === LEX_RELATIONSHIP_TYPES[LEX_VALUE_TYPES.STRING].DOES_NOT_CONTAIN) {
          passFilter &&= !d[field].includes(value);
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
