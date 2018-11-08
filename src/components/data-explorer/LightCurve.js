// Modules
import { connect } from 'react-redux';
import Loading from './Loading';
import Axis from './Axis';

const d3 = require('d3');
const React = require('react');
const margin = {
  top: 20,
  right: 26,
  bottom: 46,
  left: 50
};

function dateFn (tick) {
  const d = new Date(tick);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
}

function yFormatFn (tick) {
  return (+tick).toFixed(1);
}

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
    this.x.rangeRound([margin.left, width - margin.right]);
    this.y.rangeRound([height - margin.bottom, margin.top]);
    this.setState({ width, height });
  }

  renderSvg () {
    const { max, features } = this.props.settlements;
    const { width, height } = this.state;
    const { x, y } = this;

    const { data } = features[0].properties;
    if (!data.length) return null
    x.domain([data[0].time, data[data.length - 1].time]);
    y.domain([0, max]);

    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.movingAverage));

    const x0 = x(x.domain()[0]);
    return (
      <svg width={width} height={height}>
        <g className='lines'>
          {features.map(f => (
            <path key={f.properties.id} d={line(f.properties.data)} className='line' />
          ))}
        </g>

        <g transform={`translate(${x(x.domain()[0])},0)`}>
          <Axis orientation='vertical'
            scale={y}
            domain={y.domain()}
            ticks={y.ticks(5)}
            format={yFormatFn}
          />
        </g>

        <g transform={`translate(0,${y(0)})`}>
          <Axis orientation='horizontal'
            scale={x}
            domain={x.domain()}
            labelOffset={y(y.domain()[0]) - y(0)}
            ticks={x.ticks(5)}
            format={dateFn}
          />
        </g>
        <g className='legend' transform={`translate(${x0},${height - 18})`}>
          <line className='line legend-line' x1='0' x2='20' y1='6' y2='6' />
          <text x='25' y='10'>historical light output</text>
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
