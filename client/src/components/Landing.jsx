const Link = ReactRouter.Link;

export default class Landing extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing">
        <h1>Picky Notes</h1>
        <a href="auth/facebook">Login</a>
      </div>
    );
  }
}