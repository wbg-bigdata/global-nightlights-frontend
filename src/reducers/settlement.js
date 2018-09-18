'use strict';
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
  return d;
}

export default reducer;
