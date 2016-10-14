import React from 'react';
import { Link } from 'react-router';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('load it now.');
      init();
    }, 600);
  }

  render() {
    return (
      <div>
        <div className="homepage-hero-module">
          <div className="video-container">
            <div className="title-container">
              <a href="auth/facebook">
                <h1>Picky Notes</h1>
              </a>
              <a href="#landing1" className="landing1-link" style={{textDecoration: 'none'}}>
                <span className="cover-footer" style={{color: '#fff'}}>
                  Learn
                </span>
              </a>
              <a href="auth/facebook" className="landing1-enter" style={{textDecoration: 'none'}}>
                <span className="cover-footer" style={{color: '#fff'}}>
                  Enter
                </span>
              </a>
            </div>
            <div className="filter"></div>
            <video autoPlay loop className="fillWidth">
              <source src="https://s3-us-west-2.amazonaws.com/coverr/mp4/abcd.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
              <source src="https://s3-us-west-2.amazonaws.com/coverr/mp4/abcd.mp4" type="video/webm" />Your browser does not support the video tag. I suggest you upgrade your browser.
            </video>
            <div className="poster hidden">
              <img src="https://s3-us-west-2.amazonaws.com/coverr/poster/abcd.jpg" alt="" />
            </div>
          </div>
        </div>
        <div id="landing1">

        </div>
      </div>
    );
  }
}

export default Landing;
