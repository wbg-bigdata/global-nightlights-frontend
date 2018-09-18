import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import mgl from 'mapbox-gl';

// Config
import config from '../../config';

// Actions
import { queryCoordinates } from '../../actions';

// Components
import Modal from '../modal';
import Loading from './Loading';

// Styles: MapboxGL CSS is conflicting with current app styles, leaving comented for now
// import 'mapbox-gl/dist/mapbox-gl.css';
mgl.accessToken = config.mapboxAccessToken;

class LightMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };

    this.mapQueue = [];

    // Bindings
    this.callOnMap = this.callOnMap.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // check for GL support
    if (!mgl.supported({ failIfMajorPerformanceCaveat: true })) {
      this.setState({ unsupported: true });
      console.log('mapbox gl unsupported');
      return;
    }

    const map = window.glMap = this.map = new mgl.Map({
      container: this.refs.node,
      center: [-1.200141, 8.201226],
      zoom: 6,
      minZoom: 7,
      maxZoom: 11.5,
      dragRotate: false,
      attributionControl: false,
      style: 'mapbox://styles/devseed/cjlwrfhxm3uq72smqkcebecfn'
    });

    map.on('load', () => {
      // Interaction handlers
      map.on('click', this.onClick);

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

  onClick ({ point }) {
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

  render() {
    const cn = classnames('light-map', {
      ['light-map_' + this.props.compareMode]: this.props.compareMode
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
                  version of <a href='http://www.google.com/chrome/'>Chrome</a>,{' '}
                  <a href='https://www.mozilla.org/en-US/firefox/new/'>
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

    let loading = !this.state.loaded;
    return (
      <div className={cn}>
        {loading ? <Loading /> : ''}
        <div className='map-inner' ref='node' />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { };
};

const mapDispatchToProps = { queryCoordinates };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LightMap)
);
