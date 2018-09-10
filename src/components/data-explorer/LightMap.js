import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classnames from "classnames";
import t from "prop-types";
import bbox from "@turf/bbox";
import mgl from "mapbox-gl";

// Config
import config from "../../config";

// Actions
import { emphasize } from "../../actions/regions";

// Components
import Tooltip from "./Tooltip";
import Modal from "../modal";
import Loading from "./Loading";

// Styles: MapboxGL CSS is conflicting with current app styles, leaving comented for now
// import 'mapbox-gl/dist/mapbox-gl.css';
mgl.accessToken = config.mapboxAccessToken;

class LightMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previousActiveRegionKey: "not set",
      loaded: false
    };

    this.mapQueue = [];

    // Bindings
    this.callOnMap = this.callOnMap.bind(this);
    this.flyToNation = this.flyToNation.bind(this);
    this.flyToRegion = this.flyToRegion.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  static getDerivedStateFromProps = (props, state) => {
    const { activeRegion } = props;
    if (activeRegion.key !== state.previousActiveRegionKey) {
      return {
        ...state,
        previousActiveRegionKey: activeRegion.key
      };
    }
    return null;
  };

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
      zoom: 6,
      minZoom: 2.5,
      maxZoom: 12.5,
      dragRotate: false,
      attributionControl: false,
      style: "mapbox://styles/devseed/cjlwrfhxm3uq72smqkcebecfn"
    }));

    map.on("load", () => {
      // Interaction handlers
      map.on("mousemove", this.onMouseMove);
      map.on("click", this.onClick);

      map.addLayer({
        id: 'ghana-raster-2017',
        type: 'raster',
        source: {
          type: 'raster',
          url: 'mapbox://devseed.1lnxgk7f',
          tileSize: 256
        },
        paint: {
          'raster-opacity': 0.8,
          'raster-contrast': 0.2
        }
      });

      if (this.mapQueue.length) {
        this.mapQueue.forEach(fn => fn.call(this));
      }
      this.mapQueue = null;
      this.setState({ loaded: true });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  /**
   * Takes either a screen coordinate (e.g. from a mouse event) or a
   * GeoJSON Feature (e.g. a polygon) as the location at which to show
   * the tooltip
   */
  showTooltip(pointOrFeature) {
    // determine location for the popup
    // let point;
    // if (pointOrFeature.type === "Feature") {
    //   let cent = centroid(pointOrFeature);
    //   point = cent.geometry.coordinates;
    // } else if (
    //   pointOrFeature.type === "FeatureCollection" &&
    //   (pointOrFeature.features || []).length > 0
    // ) {
    //   let cent = centroid(pointOrFeature);
    //   point = cent.geometry.coordinates;
    // } else {
    //   if (
    //     !this.props.activeRegion.emphasized ||
    //     this.props.activeRegion.emphasized.length === 0
    //   ) {
    //     return;
    //   }
    //   point = this.map.unproject(pointOrFeature);
    // }
    // // remove old popup if it exists
    // if (this._tooltip) {
    //   this._tooltip.remove();
    //   this._tooltip = null;
    // }
    // // add tooltip
    // let content = document.createElement("div");
    // render(
    //   <Tooltip region={this.props.activeRegion} villages={this.state.villages} />,
    //   content
    // );
    // this._tooltip = new mgl.Popup({ closeOnClick: false })
    //   .setLngLat(point)
    //   .setDOMContent(content.children[0]);
    // this._tooltip.addTo(this.map);
  }

  onMouseMove({ point }) {
    const { activeRegion } = this.props;
    let subregionPattern = {
      nation: /^states-fill/,
      state: /^current-state-districts-fill/,
      district: /^(district-lights|rggvy-lights)/
    }[activeRegion.level];
    const features = this.map.queryRenderedFeatures(point);
    if (features.length) {
      let subregionFeatures = features.filter(feat =>
        subregionPattern.test(feat.layer.id)
      );
      this.props.emphasize(subregionFeatures.map(feat => feat.properties.key));
      // if any of these features have a key that maches the current region,
      // then we know that the mouse is within the current activeRegion.
      let currentRegionHover = features
        .map(f => f.properties.key && f.properties.key === activeRegion.key)
        .reduce((a, b) => a || b, false);

      this.setState({ currentRegionHover });

      if (subregionFeatures.length > 0) {
        this.showTooltip(point);
      }
    }
  }

  flyToNation() {
    this.map.flyTo({
      center: [79.667, 20.018],
      zoom: 3.5,
      speed: 1.2,
      curve: 1.42
    });
  }

  flyToRegion(region) {
    if (region.boundary) {
      this.flyToFeature({ type: "Feature", geometry: region.boundary });
    } else {
      this.flyToNation();
    }
  }

  flyToFeature(feature) {
    let [minx, miny, maxx, maxy] = bbox(feature);
    this.map.fitBounds([[minx, miny], [maxx, maxy]], {
      speed: 1.2,
      curve: 1.42
    });
  }

  callOnMap(fn) {
    if (this.state.loaded) {
      fn.call(this);
    } else {
      this.mapQueue.push(fn);
    }
  }

  render() {
    const { activeRegion} = this.props;

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

    let loading = !this.state.loaded || activeRegion.loading;
    let errors =
      !activeRegion || !this.state.villages
        ? []
        : [activeRegion, this.state.villages].map(s => s.error);

    return (
      <div className={cn}>
        {loading ? <Loading errors={errors} /> : ""}
        <div className="map-inner" ref="node" />
      </div>
    );
  }
}

LightMap.propTypes = {
  // time: t.object.isRequired,
  // match: t.object,

  // select: t.func,

  // villages: t.object,

  // rggvyFocus: t.bool,
  // onMapCreated: t.func.isRequired,
  compareMode: t.oneOf(["left", "right", false])
};

const mapStateToProps = state => {
  return {
    activeRegion: state.activeRegion
  };
};

const mapDispatchToProps = {
  emphasize
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LightMap)
);
