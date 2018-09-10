// Modules
import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header id="site-header" className="clearfix" role="banner">
        <h1 id="site-title">
          <a href="#/" title="Global Night Lights">
            <span>Global Night Lights</span>
          </a>
        </h1>
        <nav id="site-prime-nav">
          <ul className="global-menu"></ul>
        </nav>
      </header>
    );
  }
}

export default Header;
