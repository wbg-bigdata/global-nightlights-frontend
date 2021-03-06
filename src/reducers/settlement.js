import { max } from 'd3';
import movingAverage from '../lib/moving-average';

const initialState = {
  loading: false,
  settlements: null
};

function reducer (state = initialState, { type, next }) {
  if (type === 'query_coordinates_inflight') {
    state = Object.assign({}, state, { loading: true });
  } else if (type === 'query_coordinates_success') {
    state = Object.assign({}, state, { loading: false });
    state.settlements = processSettlement(next.results);
  } else if (type === 'query_coordinates_failed') {
    state = Object.assign({}, state, { loading: false });
  }
  return state;
}

function processSettlement (d) {
  // Only render the first feature that has a populated data array
  let features = d.features.filter(d => d.properties.data.length)
  features = features.length ? features.slice(0, 1) : d.features[0]

  features.forEach(f => {
    f.properties.data.forEach(d => {
      d.rade9 = Number(d.rade9);
      d.time = new Date(d.scanned_at).getTime();
    });
  });
  // Calculate max
  const accessor = (d) => d.rade9;
  // Attach moving average
  features.forEach(d => {
    movingAverage(d.properties.data, accessor);
  });

  let lightReadings = features.map(f => f.properties.data.map(d => d.movingAverage));
  let _max = lightReadings.reduce((compare, current) => {
    let m = max(current);
    return m > compare ? m : compare
  }, 0);
  return {
    max: _max,
    features: features
  };
}

export default reducer;
