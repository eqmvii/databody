import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'

// Stopping point / dear diary: Well, here's a puzzle. Do I need redux? I might need redux. I've learned that I can't pass state through routes.
// That leaves few choices for handling things from here.
// So... redux? 
// First some sleep. Then redux!
// NO INSTEAD THE WORLD'S HACKIEST LOGIN. Literally nothing has ever been hackier, this is the top 100% most hackiest. 

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

class Login extends Component {
  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {redirect: false};
  }

  handleLogin() {
    // alert("Login!");
    // TODO: Come back and make this less horrible
    sessionStorage.setItem('authed', 'true');
    console.log(sessionStorage.getItem('authed'));
    this.setState({redirect: true});

  }

  render () {
    console.log(this.props);
    if (this.state.redirect) {
      return (<Redirect to="/protected"/>);

    }
    else {
    return (
    <div>
      <h2>Hello {this.props.test}! Welcome to login. Login!</h2>
      <br />
      <button className="btn btn-primary" onClick={this.handleLogin}>Login</button>
    </div>
  )}
}
}

const Weighin = () => (
  <div>
    <h2>Here is to weigh in!</h2>
  </div>
)

const Protected = () => (
  <div>
    <h2>!!! SECRET PROTECTED PAGE NICE !!!</h2>
  </div>
)

const Mystats = () => (
  <div>
    <h2>Hey here is about your stats, ok!</h2>
  </div>
)


const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )} />
  </div>
)

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
)


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
    };


  }



  // Load some data from the server to demonstrate communication between
  // the client and Node
  async componentDidMount() {
    try {
      const data = await fetch('/example-path');
      const json = await data.json();
      this.setState(json);
    } catch (e) {
      console.log("Failed to fetch message: ", e);
    }
  }

  render() {
    return (

      <div className="App">
        <Router>
          <div>
            <Nav />
            <header className="App-header">
              <h1 className="App-title">Welcome to NKO!</h1>
            </header>
            <Route path="/login" component={Login} />
            <Route path="/logout" render={() => {
              // TODO: Make this less hacky
                  sessionStorage.setItem('authed', 'false');
            return (<Redirect to="/login"/>);                
              
            }} />
            <Route path="/weighin" component={Weighin} />
            <Route path="/mystats" component={Mystats} />
            <PrivateRoute path="/protected" component={Protected} authed={sessionStorage.getItem("authed")} />
            <p> {this.state.message} </p>
          </div>
        </Router>
      </div>
    );
  }
}

var fakeAuth = {};
fakeAuth.isAuthenticated = true;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    rest.authed === "true" ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
  )} />
)


const Nav = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link to="/" className="navbar-brand">DataBody</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item active">
          <Link to="/weighin" className="nav-link">Weigh-In</Link>
        </li>
        <li className="nav-item">
          <Link to="/mystats" className="nav-link">My Stats</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
        <li className="nav-item">
          <Link to="/protected" className="nav-link">Protected</Link>
        </li>
        <li className="nav-item">
          <Link to="/logout" className="nav-link">Logout</Link>
        </li>
      </ul>
    </div>
  </nav>)

export default App;
