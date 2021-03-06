const React = require('react');
const classnames = require('classnames');

const labelOffset = 5;

class Axis extends React.Component {
  render () {
    let {
      scale,
      ticks,
      tickClasses,
      domain,
      format,
      orientation,
    } = this.props;

    let [x1, x2] = domain.map(scale);

    let y1 = 0;
    let y2 = 0;

    if (orientation === 'vertical') {
      y1 = x1;
      y2 = x2;
      x1 = 0;
      x2 = 0;
    }

    if (!format) { format = scale; }

    if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) ||
      typeof scale.ticks !== 'function') {
      return <g></g>;
    }

    // ticks = standard ticks unioned with marker positions
    ticks = ticks || [];
    tickClasses = tickClasses || ticks.map(t => '');

    return (
      <g className={classnames('axis', orientation)}>
        {ticks
        .filter((tick, i) => tick + i !== 0)
        .map((tick) => {
          let mi = ticks.indexOf(tick);
          let klass = 'label tick ' + (mi >= 0 ? (tickClasses[mi] || '') : '');
          return (<text className={klass} key={tick}
            x={orientation === 'vertical' ? labelOffset - 5 : scale(tick)}
            y={orientation === 'vertical' ? scale(tick) : labelOffset }
            dy={orientation === 'vertical' ? 0 : '1em'}
            dx={orientation === 'vertical' ? '-5px' : 0}
            textAnchor={orientation === 'vertical' ? 'end' : 'middle'} >

            {format(tick)}

          </text>);
        }
        )}
      </g>
    );
  }
}

module.exports = Axis;
