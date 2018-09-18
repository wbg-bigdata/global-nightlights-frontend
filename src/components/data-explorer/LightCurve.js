// Modules
import { connect } from 'react-redux';
import Loading from './Loading';

const d3 = require('d3');
const React = require('react');
/*
const LineChart = require('../line-chart');
*/

/**
 * Container view for the light curves plot.
 */
class LightCurves extends React.Component {
  constructor (props) {
    super(props);
    this.node = React.createRef();
    this.setHeight = this.setHeight.bind(this);
    this.state = {
      width: null,
      height: null
    };
    this.x = d3.scaleLinear();
    this.y = d3.scaleLinear();
  }

  componentDidMount () {
    // capture initial height (presumably set in css)
    window.addEventListener('resize', this.setHeight);
    this.setHeight();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight);
  }

  setHeight () {
    const node = this.node.current;
    const { width, height } = node.getBoundingClientRect();
    this.x.rangeRound([0, width]);
    this.y.rangeRound([height, 0]);
    this.setState({ width, height });
  }

  componentDidUpdate () {
  }

  renderSvg () {
    const { max, features } = this.props.settlements;
    const { width, height } = this.state;
    const { x, y } = this;

    const { data } = features[0].properties;
    x.domain([data[0].time, data[data.length - 1].time]);
    y.domain([0, max]);

    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.rade9));

    return (
      <svg width={width} height={height}>
        <g className='lines'>
          {features.map(f => (
            <path key={f.properties.id} d={line(f.properties.data)} className='line' />
          ))}
        </g>
      </svg>
    );
  }

  renderPlaceholder () {
    return (
      <div className='placeholder'>
        <p>Click a location to see historic light curves.</p>
      </div>
    );
  }

  render () {
    return (
      <div ref={this.node} className='container-light-curves'>
        <div className='light-curves'>
          {this.props.loading ? <Loading /> : null}
          {this.props.settlements ? this.renderSvg() : null}
          {!this.props.loading && !this.props.settlements ? this.renderPlaceholder() : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  settlements: state.settlement.settlements,
  loading: !!state.settlement.loading
});

export default connect(mapStateToProps)(LightCurves);
