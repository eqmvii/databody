// App.js - for DataBody, Eric Mancini's Node Knockout Hackathon Entry

// CURRENT STATUS:
/*
  Under active development!
*/


import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'

class NewLoginForm extends Component {
  constructor(props) {
    super(props);

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);


    if (sessionStorage.authed === "true") {
      this.state = { loggedin: true };
    }
    else {
      this.state = { loggedin: false, username: '', password: '', error: '' };
    }
  }

  handleFormChange(event) {
    const target = event.target;
    const name = event.target.name;
    // use computed object key. Thanks react docs!
    this.setState({ [name]: event.target.value });
  }

  handleLogin(event) {
    event.preventDefault();
    console.log(this.state);
    // validate input before talkign to the server
    if (this.state.username === '') {
      this.setState({ error: 'must enter a username' });
      return;
    }
    else if (this.state.password === '') {
      this.setState({ error: 'must enter a password' });
      return;
    }
    fetch('/login', { credentials: 'include', method: "POST", body: JSON.stringify({ username: this.state.username, password: this.state.password }) })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else { throw Error(res.statusTest) }
      })
      .then(res => {
        console.log("Server responds: ");
        console.log(res);
        if (res.error) {
          this.setState({
            error: res.error_message,
            username: '',
            password: '',
          });
          return;
        } else {
          // Process login
          sessionStorage.authed = "true";
          sessionStorage.username = res.username;
          this.setState({ username: '', password: '', error: '', loggedin: true });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    // console.log(this.props);
    console.log(`Rendering login route. Authed: ${sessionStorage.authed}. Redirect state: ${this.state.loggedin}`);

    if (this.state.loggedin) {
      console.log("You're logged in...");
      return (<Redirect to={{
        pathname: '/stats'
      }} />);
    }
    else {
      var error_message = false;
      if (this.state.error) {
        error_message = (<div className="alert alert-danger" role="alert"><strong>ERROR: </strong>{this.state.error}</div>);
      }
      console.log("You are not logged in, so here's the login route");
      return (
        <form onSubmit={this.handleLogin}>

          <h3 className="text-center">Login</h3>

          {error_message}

          <div className="form-group">
            <label htmlFor="usernamelogin">Username</label>
            <input
              type="text"
              className="form-control"
              id="usernamelogin"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.handleFormChange} />
          </div>

          <div className="form-group">
            <label htmlFor="passwordlogin">Password</label>
            <input
              type="password"
              className="form-control"
              id="passwordlogin"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleFormChange}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" onClick={this.handleLogin}>Login</button>
          </div>

        </form>
      )
    }
  }
}

const Home = () => (
  <div className="row">
    <div className="col-8">
      <h3 className="text-center">Welcome to DataBody!</h3>
      <p>Contrary to popular belief, Lorem Ipsum is not simply random text. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
      <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
    </div>
    <div className="col-4">
      <NewLoginForm />
    </div>
  </div>
)


class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);


    this.state = {
      username: '',
      password: 'choose',
      error: '',
    }

  }

  handleFormChange(event) {
    const target = event.target;
    const name = event.target.name;
    // use computed object key. Thanks react docs!
    this.setState({ [name]: event.target.value });

  }

  handleRegister(event) {
    event.preventDefault();
    console.log(" ### REGISTER SUBMIT ###");
    console.log("State: ");
    console.log(this.state);

    // handle various registration error scenarios
    if (this.state.username === "") {
      this.setState({ error: 'You must select pick a username to register.' });
      return;
    }
    if (this.state.password === "choose") {
      this.setState({ error: 'You must select one of the weak passwords.' });
      return;
    }

    // no validation errors, so attempt to register:

    var registration = {};
    registration.username = this.state.username;
    registration.password = this.state.password;
    registration.email = "fake@email.com";
    registration.activity = 0;
    registration.height = 100;
    registration.age = 100;

    fetch('/register', { credentials: 'include', method: "POST", body: JSON.stringify(registration) })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else { throw Error(res.statusTest) }
      })
      .then(res => {
        console.log("Server responds: ");
        console.log(res);
        if (res.duplicate) {
          this.setState({
            error: 'Username already registered!',
            username: '',
            password: 'choose',
          });
          return;
        } else {
          // process logging in the newly registered user
          sessionStorage.authed = "true";
          sessionStorage.username = res.username;
          this.setState({ username: '', password: 'choose', error: '' });
        }
      })
      .catch(err => console.log(err));

    //alert("Tryin' to register I see!");
    /*
        sessionStorage.authed = "true";
        console.log(`Login clicked. Authed: ${sessionStorage.authed}`);
        this.setState({ loggedin: true });
        */
  }

  render() {
    if (sessionStorage.authed === "true") {
      console.log("You're logged in... can't register again...");
      return (<Redirect to={{
        pathname: '/stats'
      }} />);
    }
    else {
      console.log("You are not logged in, so here's the REGISTER route");
      var error_message = false;
      if (this.state.error) {
        error_message = (<div className="alert alert-danger" role="alert"><strong>ERROR: </strong>{this.state.error}</div>);
      }

      return (
        <form onSubmit={this.handleRegister}>
          <h3 className="text-center">Register</h3>
          {error_message}
          <div className="form-group">
            <label htmlFor="usernameregister">Username</label>
            <input
              type="text"
              className="form-control"
              id="usernameregister"
              placeholder="Enter username"
              name="username"
              value={this.state.username}
              onChange={this.handleFormChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Password</label>
            <select className="form-control" id="exampleFormControlSelect1" name="password" onChange={this.handleFormChange} value={this.password}>
              <option value="choose">Choose...</option>
              <option value="123">123</option>
              <option value="abc">abc</option>
              <option value="pwd">pwd</option>
            </select>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" onClick={this.handleRegister}>Submit</button>
          </div>
        </form>
      )
    }
  }
}


const Register = () => (
  <div className="row">
    <div className="col-6 offset-3">
      <RegisterForm />
    </div>
  </div>
)

const Login = () => (
  <div className="row">

    <div className="col-6 offset-3">
      <NewLoginForm />
    </div>

  </div>
)

// TODO: Handle form number selection issues and parsing
class Weigh extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

    this.state = {
      weight: 0,
      message: '',
      username: sessionStorage.username,
    }

  }

  handleFormChange(event) {
    const target = event.target;
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(" ### WEIGHT SUBMIT ###");
    console.log("State: ");
    console.log(this.state);

    // handle various registration error scenarios
    if (this.state.weight === "") {
      this.setState({ error: 'You must select enter your weight' });
      return;
    }

    var weight_data = {
      username: this.state.username,
      weight: this.state.weight,
    }

    fetch('/addweight', { credentials: 'include', method: "POST", body: JSON.stringify(weight_data) })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else { throw Error(res.statusTest) }
      })
      .then(res => {
        console.log("Server responds: ");
        console.log(res);
        this.setState({ weight: 0, message: res });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.message) {
      var response_message = (<div className="alert alert-success"><strong>Success: </strong>{this.state.message}</div>);
    }
    else {
      var response_message = false;
    }
    return (
      <div className="row">
        <div className="col-6 offset-3 text-center">
          {response_message}
          <form onSubmit={this.handleSubmit}>

            <h3>Add Weight Data</h3>
            <br />

            <div className="form-group">
              <label htmlFor="weightinput">Current Weight</label>
              <input
                className="form-control col-4 offset-4"
                id="weightinput"
                name="weight"
                type="text"
                placeholder="Enter weight"
                value={this.state.weight}
                onChange={this.handleFormChange} />
            </div>

            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={this.handleSubmit}>Submit</button>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

class Protected extends Component {
  render() {
    console.log(`Rendering the protected element... authed is ${sessionStorage.authed}`);
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <br />
          <h2>PROTECTED PAGE</h2>
        </div>
      </div>
    )
  }
}

class Stats extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <h2 className="text-center">Hello {sessionStorage.username}! Your Stats</h2>
          <ul>
            <li>userid: </li>
            <li>username: </li>
            <li>email: </li>
            <li>height: </li>
            <li>age: </li>
            <li>activity: </li>
            <li>stamp: </li>
          </ul>
        </div>
      </div>
    )
  }
}


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

// old routing example
const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
)


class App extends Component {
  constructor(props) {
    super(props);

    // clear session storage
    // TODO BUG ALERT ALARMA turn this off for production
    sessionStorage.clear();

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
    console.log("# # # Rendering the app!");
    return (

      <div className="App">
        <Router>
          <div>
            <main role="main" className="container">

              <Nav />
              <div className="jumbotron text-center">
                <h1>Data Body</h1>
                <h4>Health Data Visualized</h4>
              </div>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/logout" render={() => {
                // TODO: Make this less hacky
                console.log("logout clicked, logging out...");
                sessionStorage.removeItem('authed');
                sessionStorage.removeItem('username');
                return (<Redirect to="/login" />);
              }} />
              <PrivateRoute path="/weigh" component={Weigh} />
              <PrivateRoute path="/stats" component={Stats} />
              <PrivateRoute path="/protected" component={Protected} />
              <br />
              <p className="text-center"> {this.state.message} </p>
            </main>
          </div>
        </Router>
      </div>
    );
  }
}



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    sessionStorage.authed === "true" ? (
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
  <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
    <Link to="/" className="navbar-brand">DataBody</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/weigh" className="nav-link">Weigh</Link>
        </li>
        <li className="nav-item">
          <Link to="/stats" className="nav-link">Stats</Link>
        </li>
        <li className="nav-item">
          <Link to="/protected" className="nav-link">|Protected|</Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">Register</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
        <li className="nav-item">
          <Link to="/logout" className="nav-link">Logout</Link>
        </li>
      </ul>
    </div>
  </nav>)

export default App;
