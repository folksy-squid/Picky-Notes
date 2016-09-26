const Link = ReactRouter.Link;

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing">
        <h1>Picky Notes</h1>
        <a href="auth/facebook"><i className="fa fa-facebook" aria-hidden="true"></i><span>Login</span></a>
      </div>
    );
  }
}