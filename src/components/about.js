import React from 'react';

class About extends React.Component {
  render () {
    return (
      <article className='page single about'>
        <header className='page-header'>
          <div className='inner'>
            <div className='page-headline'>
              <h1 className='page-title'>About</h1>
            </div>
          </div>
        </header>
        <div className='page-body'>
          <div className='inner'>
            <div className='prose'>
              <p>Global Night Lights is a collaboration between Development Seed, the World Bank, the University of Michigan, and NOAA.</p>
              <p>This project is an update to <a target='_blank' href='http://nightlights.io/'>India Night Lights</a>.</p>
              <h2><a href='https://wbg-bigdata.github.io/global-nightlights-api/api/'>Get the Data</a></h2>
              <p>The data from this platform is open-source. It can be accessed from the <a href='https://wbg-bigdata.github.io/global-nightlights-api/api/'>Global Night Lights API</a>.</p>
              <p>Email <a href='mailto:brianmin@umich.edu'>brianmin@umich.edu</a> or <a href='mailto:kgaba@worldbank.org'>kgaba@worldbank.org</a> with questions.</p>
            </div>
          </div>
        </div>
        <footer className='page-footer'>
          <div className='inner'>
            <ul className='credits-list'>
              <li className='umich-logo-wrapper'><a href='http://umich.edu' title='Visit the University of Michigan'><img alt='The University of Michigan logo' src='./umich-logo.png' height='48' /><span>University of Michigan</span></a></li>
              <li className='wbg-logo-wrapper'><a href='http://www.worldbank.org/' title='Visit The World Bank'><img alt='The World Bank logo' src='./wbg-logo-neg.svg' width='160' height='48' /><span>The World Bank</span></a></li>
              <li className='ds-logo-wrapper'><a href='https://developmentseed.org/' title='Visit Development Seed'><img alt='Development Seed logo' src='./ds-logo-neg.svg' width='188' height='48' /><span>Development Seed</span></a></li>
              <li className='noaa-logo-wrapper'><a href='http://www.noaa.gov/' title='Visit NOAA'><img alt='NOAA logo' src='./NOAA-logo.svg' height='64' /><span>NOAA</span></a></li>
            </ul>
          </div>
        </footer>
      </article>
    );
  }
};
export default About;
