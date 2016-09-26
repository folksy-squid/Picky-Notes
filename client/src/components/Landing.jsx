import React from 'react';
import { Link } from 'react-router';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing">
        <h1>Picky Notes</h1>
        <a href="auth/facebook"><i className="ion ion-social-facebook" aria-hidden="true"></i><span>Login</span></a>
      </div>
    );
  }
}

export default Landing;