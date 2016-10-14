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
              <hr></hr>
              <p>
                A collaborative note taking application that reinforces active learning through note comparison.
              </p>
              <a href="#landing1" className="landing1-link" style={{textDecoration: 'none'}}>
                <span className="cover-footer" style={{color: '#fff'}}>
                  Learn more
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
        <div id="landing1" className="landing-section">
          <h1 className="landing-subheading">
            What
          </h1>
          <hr />
          <p>
          Picky Notes is a collaborative note taking application that allows students to discover where their understanding may differ from others around them.
          We believe a stronger connection is formed between concepts by linking written notes with the audio associated in the lecture.
          </p>
        </div>
        <div id="landing2" className="landing-section">
          <h1 className="landing-subheading">
            How
          </h1>
          <hr style={{'border': '3px black solid'}}/>
          <div className="row">
            <div className="col-xs-3">
              1. Start recording
            </div>
            <div className="col-xs-3">
              2. Start taking notes, or commenting your thoughts, using Markdown
            </div>
            <div className="col-xs-3">
              3. Pick your favorite notes from a group of friends
            </div>
            <div className="col-xs-3">
              4. Review your notes
            </div>
          </div>

        </div>
        <div id="landing3" className="landing-section">
          screenshots go here
        </div>
        <div id="landing4" className="landing-section">
          <p>
          Created with &lt;3 by Sean Ng, Derek Liu, Marco Chan, and Kunal Rathi
          </p>
        </div>
      </div>
    );
  }
}

export default Landing;
