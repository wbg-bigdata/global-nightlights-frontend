// Modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header id='site-header' className='clearfix' role='banner'>
        <h1 id='site-title'>
          <Link to='/' title='Global Night Lights'>
            <span>Global Night Lights</span>
          </Link>
        </h1>
        <nav id='site-prime-nav'>
          <ul className='global-menu'>
            <li><Link to='about'>About</Link></li>
            <li><a href='https://wbg-bigdata.github.io/global-nightlights-api/api/'>Data</a></li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
