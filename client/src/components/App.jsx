export default class App extends React.Component {

  constructor(props) {
    super(props);
    // REDUX?
    this.state = {
      isAuth: false,
      user: {}
    };
  }

  componentWillMount() {   //  Retrieve the data, check if user logged in

    var context = this;

    $.get('/checkLogin').then(function(data) {
      context.setState({
        isAuth: data === 'authenticated'
      });
    }).catch(function(err) {
      // REDUX?
      context.setState({
        isAuth: false
      });
    });

    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        context.setUser(user);
      }
    });

  }

  checkAuthState () {
    // REDUX?
    return this.state.isAuth;
  }

  render() {   //  Depending on authentication, serves different nav-bar
    var context = this;
    var checkAuthState = this.checkAuthState;
    var children = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {
        auth: checkAuthState,
        user: context.state.user
      });
    });
    return (
      <div>
        <Navbar/>
        {children}
      </div>
    );
  }
}