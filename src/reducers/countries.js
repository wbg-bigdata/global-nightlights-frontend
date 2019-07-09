const initialState = {
  loading: false,
  data: []
};

function reducer(state = initialState, { type, next }) {
  if (type === "query_countries_inflight") {
    state = Object.assign({}, state, { loading: true });
  } else if (type === "query_countries_success") {
    state = Object.assign({}, state, { loading: false });
    state.data = next.data.map(c => {
      c.bounds = c.bbox
        .replace("BOX(", "")
        .replace(")", "")
        .split(",")
        .map(p => p.split(" ").map(v => parseFloat(v)));
      return c;
    });
  } else if (type === "query_countries_failed") {
    state = Object.assign({}, state, { loading: false });
  }
  return state;
}

export default reducer;
