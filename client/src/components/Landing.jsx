import React from 'react';
import { Link } from 'react-router';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
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
              <p className="landing-para">
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
            <video autoPlay loop style= {{display: 'block', width: '100%', height: '100%', objectFit  : 'cover', position: 'absolute', top: '0', left: '0'}}>
              <source src="https://s3-us-west-2.amazonaws.com/coverr/mp4/abcd.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
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
          <p className="landing-para">
          Picky Notes is a collaborative note taking application that allows students to discover where their understanding may differ from others around them.
          We believe a stronger connection is formed between concepts by linking written notes with the audio associated in the lecture.
          </p>
        </div>
        <div id="landing2" className="landing-section">
          <h1 className="landing-subheading">
            How
          </h1>
          <hr style={{'border': '3px black solid'}}/>
          <div className="container-fluid">
            <div className="col-sm-6 col-md-4">
              <h5>
                1. Create/join a lecture
              </h5>
              <p>
                Share the link with your friends and discuss your thoughts around the lecture.
              </p>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>
                2. Start recording
              </h5>
              <p>
                Verbatim
              </p>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>
                3. Take notes
              </h5>
              <p>
                Using markdown language. You can also take private notes (called thoughts).
              </p>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>
                4. Edit your notes
              </h5>
              <p>
                After the lecture has ended, you can modify or add notes and assign them to a timestamp.
              </p>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>
                5. Pick your favorite notes
              </h5>
              <p>
                After the lecture has ended, you can modify or add notes and assign them to a timesatmp.
              </p>
            </div>
            <div className="col-sm-6 col-md-4">
              <h5>
                6. Review
              </h5>
              <p>
                After the lecture has ended, you can modify or add notes and assign them to a timesatmp.
              </p>
            </div>
          </div>
        </div>
        <div id="landing3" className="landing-section">
          screenshots go here
        </div>
        <div id="landing4" className="landing-section">
          <p className="landing-para">
          Created with &lt;3 by Sean Ng, Derek Liu, Marco Chan, and Kunal Rathi
          </p>
        </div>
      </div>
    );
  }
}

export default Landing;
