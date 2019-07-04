import { json } from "d3";

const apiUrl = "https://global-nightlights-api.devseed.com";

export function queryCoordinates(coordinates) {
  return dispatch => {
    dispatch({ type: "query_coordinates_inflight" });
    json(`${apiUrl}/observations?limit=5&nearby=${coordinates.join(",")}`)
      .then(results => {
        return dispatch({
          type: "query_coordinates_success",
          next: { results }
        });
      })
      .catch(e => {
        console.log("API query error", e);
        return dispatch({ type: "query_coordinates_failed" });
      });
  };
}
export function queryCountries() {
  return dispatch => {
    dispatch({ type: "query_countries_inflight" });
    json(`${apiUrl}/countries`)
      .then(results => {
        return dispatch({
          type: "query_countries_success",
          next: { data: results.countries }
        });
      })
      .catch(e => {
        console.log("API query error", e);
        return dispatch({ type: "query_countries_failed" });
      });
  };
}
