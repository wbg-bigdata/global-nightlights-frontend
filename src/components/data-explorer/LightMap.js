import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classnames from "classnames";
import mgl from "mapbox-gl";

// Config
import config from "../../config";

// Actions
import { queryCoordinates, queryCountries } from "../../actions";

// Components
import Modal from "../modal";
import Loading from "./Loading";

// Styles: MapboxGL CSS is conflicting with current app styles, leaving comented for now
// import 'mapbox-gl/dist/mapbox-gl.css';
mgl.accessToken = config.mapboxAccessToken;

class LightMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      activeCountry: null
    };

    this.mapQueue = [];

    // Bindings
    this.callOnMap = this.callOnMap.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // check for GL support
    if (!mgl.supported({ failIfMajorPerformanceCaveat: true })) {
      this.setState({ unsupported: true });
      console.log("mapbox gl unsupported");
      return;
    }

    const map = (window.glMap = this.map = new mgl.Map({
      container: this.refs.node,
      center: [-1.200141, 8.201226],
      zoom: 6.1,
      maxZoom: 15,
      dragRotate: false,
      attributionControl: false,
      style: "mapbox://styles/devseed/cjoarsdgq1l1u2smn1rrrwo4u"
    }));

    map.on("load", () => {
      // Interaction handlers
      map.on("click", this.onClick);

      const empty = {
        type: "FeatureCollection",
        features: []
      };

      map.addSource("settlements", {
        type: "geojson",
        data: empty
      });

      map.addLayer({
        id: "highlight-settlements",
        type: "circle",
        source: "settlements",
        paint: {
          "circle-radius": 5,
          "circle-color": "#EFC20D"
        }
      });

      if (this.mapQueue.length) {
        this.mapQueue.forEach(fn => fn.call(this));
      }
      this.mapQueue = null;
      this.setState({ loaded: true });
    });
  }

  componentWillMount() {
    this.props.queryCountries();
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (this.props.settlements !== prevProps.settlements) {
      this.map.getSource("settlements").setData({
        type: "FeatureCollection",
        features: this.props.settlements.features
      });
    }

    // Initialize activeCountry when country list is fetched
    const { activeCountry } = this.state;
    const { countries } = this.props;
    if (!activeCountry && countries.length > 0) {
      this.changeCountry(countries[0].id);
    }
  }

  onClick({ point }) {
    const coords = this.map.unproject(point);
    this.props.queryCoordinates([coords.lng, coords.lat]);
  }

  callOnMap(fn) {
    if (this.state.loaded) {
      fn.call(this);
    } else {
      this.mapQueue.push(fn);
    }
  }

  changeCountry(id) {
    const country = this.props.countries.find(c => c.id === id);
    this.callOnMap(() => {
      this.map.fitBounds(country.bounds, {
        padding: { top: 100, bottom: 200, left: 0, right: 0 },
        linear: true
      });
    });
    this.setState({ activeCountry: id });
  }

  render() {
    const { loadingCountries, countries } = this.props;
    const { activeCountry } = this.state;

    let loading = !this.state.loaded;

    const cn = classnames("light-map", {
      ["light-map_" + this.props.compareMode]: this.props.compareMode
    });

    if (this.state.unsupported) {
      return (
        <div className={cn}>
          <Modal
            isOn
            isPermanent
            content={{
              title: <h1>WebGL Not Supported</h1>,
              body: (
                <p>
                  The visualizations on this site require a browser with WebGL
                  rendering capabilities. Please try viewing it with a newer
                  version of <a href="http://www.google.com/chrome/">Chrome</a>,{" "}
                  <a href="https://www.mozilla.org/en-US/firefox/new/">
                    Firefox
                  </a>
                  , or Safari.
                </p>
              )
            }}
          />
        </div>
      );
    }

    return (
      <div className={cn}>
        {loading ? <Loading /> : ""}
        <div className="map-inner" ref="node" />
        <div className="map-location-select-wrap">
          <ul className="map-location-select">
            {loadingCountries ? (
              <li>Loading countries...</li>
            ) : (
              countries.map(c => (
                <li
                  key={c.id}
                  data-id={c.id}
                  onClick={e => this.changeCountry(e.currentTarget.dataset.id)}
                  className={classnames("map-location", {
                    "map-location-active": activeCountry === c.id
                  })}
                >
                  {c.name}
                </li>
              ))
            )}
          </ul>
          <ul className="map-legend">
            <li className="legend-item legend-item-green">
              Electrified settlement
            </li>
            <li className="legend-item legend-item-red">
              Unelectrified settlement
            </li>
            <li className="legend-item legend-item-grad">
              Average light output
            </li>
          </ul>
          <p className="map-sources">
            Sources: NOAA VIIRS DNB, CIESIN/Facebook HRSL
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { loading: loadingCountries, data: countries } = state.countries;
  const { settlements } = state.settlement;
  return {
    loadingCountries,
    countries,
    settlements
  };
};

const mapDispatchToProps = { queryCoordinates, queryCountries };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LightMap)
);
