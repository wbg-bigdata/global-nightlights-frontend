import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classnames from "classnames";

// Components
import LightMap from "./LightMap";
import LightCurves from "./LightCurve";

class DataExplorer extends React.Component {
  render() {
    const { compare } = this.props;
    return (
      <div className={classnames("data-container", { compare: !!compare })}>
        <LightMap />
        <LightCurves />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DataExplorer)
);
