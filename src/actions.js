import { json } from 'd3';

export function queryCoordinates (coordinates) {
  return (dispatch) => {
    dispatch({ type: 'query_coordinates_inflight' });
    json('https://global-nightlights-api.devseed.com/observations?limit=5&nearby=' + coordinates.join(',')).then(results => {
      return dispatch({ type: 'query_coordinates_success', next: { results }});
    }).catch(e => {
      console.log('API query error', e);
      return dispatch({ type: 'query_coordinates_failed' });
    });
  };
}


