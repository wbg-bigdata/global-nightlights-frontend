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

const initialCountry = 'ghana';
const countries = ['ghana', 'kenya'];
const locations = {
  ghana: [-1.200141, 8.201226],
  kenya: [37.842151, 0.253297]
};

function displayCase (s) {
  return s.charAt(0).toUpperCase() + s.slice(1, s.length);
}

// Styles: MapboxGL CSS is conflicting with current app styles, leaving comented for now
// import 'mapbox-gl/dist/mapbox-gl.css';
mgl.accessToken = config.mapboxAccessToken;

class LightMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      country: initialCountry
    };

    this.mapQueue = [];

    // Bindings
    this.callOnMap = this.callOnMap.bind(this);
    this.setMapLoc = this.setMapLoc.bind(this);
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
      zoom: 6.1,
      minZoom: 6,
      maxZoom: 15,
      dragRotate: false,
      attributionControl: false,
      style: 'mapbox://styles/devseed/cjlwrfhxm3uq72smqkcebecfn'
    });

    map.on('load', () => {
      // Interaction handlers
      map.on('click', this.onClick);

      const empty = {
        type: 'FeatureCollection',
        features: []
      };

      map.addSource('settlements', {
        type: 'geojson',
        data: empty
      });

      map.addLayer({
        id: 'highlight-settlements',
        type: 'circle',
        source: 'settlements',
        paint: {
          'circle-radius': 5,
          'circle-color': '#EFC20D'
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

  componentDidUpdate (prevProps) {
    if (this.props.settlements !== prevProps.settlements) {
      this.map.getSource('settlements').setData({
        type: 'FeatureCollection',
        features: this.props.settlements.features
      });
    }
  }

  onClick ({ point }) {
    const coords = this.map.unproject(point);
    this.props.queryCoordinates([coords.lng, coords.lat]);
  }

  callOnMap (fn) {
    if (this.state.loaded) {
      fn.call(this);
    } else {
      this.mapQueue.push(fn);
    }
  }

  setMapLoc (e) {
    const id = e.currentTarget.getAttribute('data-id');
    this.setState({country: id});
    this.callOnMap(() => {
      this.map.flyTo({
        center: locations[id]
      })
    })
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
        <div className='map-location-select-wrap'>
          <ul className='map-location-select'>
            {countries.map(c => (
              <li data-id={c} onClick={this.setMapLoc}
                className={classnames('map-location', {'map-location-active': this.state.country === c})}>{displayCase(c)}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    settlements: state.settlement.settlements
  };
};

const mapDispatchToProps = { queryCoordinates };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LightMap)
);
