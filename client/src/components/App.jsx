export default class App extends React.Component {

  constructor(props) {
    super(props);
    // REDUX?
    this.state = {
      isAuth: false,
      user: {}
    };
  }

  render() {
    var context = this;
    // var children = React.Children.map(this.props.children, function(child) {
    //   return React.cloneElement(child, {
    //     auth: context.checkAuthState,
    //     user: context.getUser
    //   });
    // });
    var children = React.cloneElement(this.props.children, this.props)
    return (
      <div>
        <Navbar/>
        {children}
      </div>
    );
  }
}