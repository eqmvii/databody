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

class LoginForm extends Component {
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
    // console.log(`Rendering login route. Authed: ${sessionStorage.authed}. Redirect state: ${this.state.loggedin}`);

    if (this.state.loggedin) {
      // console.log("You're logged in...");
      return (<Redirect to={{ pathname: '/stats' }} />);
    }
    else {
      var error_message = false;
      if (this.state.error) {
        error_message = (<div className="alert alert-danger" role="alert"><strong>ERROR: </strong>{this.state.error}</div>);
      }
      // console.log("You are not logged in, so here's the login route");
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
            <button type="submit" className="btn btn-primary" onClick={this.handleLogin}><i className="fa fa-sign-in" aria-hidden="true"></i> Login</button>
          </div>

        </form>
      )
    }
  }
}

class Home extends Component {

  componentDidMount() {
    // TODO ALARMA: auto login if there's already a session
  }

  render() {
    var myimage = (<img id="frontpagechart" src="rawweightchart.jpg" className="img-fluid img-thumbnail" alt="weight data chart" />);
    // disable image
    //myimage = false;
    return (
      <div>
        <div className="row">
          <div className="col-sm-8 border" id="mysplash">
            <h3 className="text-danger">Welcome!</h3>
            <p>How many Calories did you consume yesterday?</p>
            <p>Data Body can tell you, without you needing to track what you eat! Of course there is one catch - you're going to need to weigh yourself several times per day, for several days. Once you've fed the app enough weight data, it will use Math to calculate how much you've been eating.</p>
            <div className="text-center">
              <p>
                <button className="btn btn-lg btn-success">
                  <Link to="/register" style={{ "color": "white" }}>
                    <i className="fa fa-handshake-o" aria-hidden="true">
                    </i> Register
                  </Link></button></p>
            </div>
            <p>It will take several days to gatehr enough data. But if you can keep it up, you'll get data-driven feedback to help you gain, maintain, or lose weight!</p>
            <p>The secret is understanding how erratic a person's weight is throughout the day. Stepping on the scale now and then can give you a badly distorted idea of your progress, since a person's weight fluctuates several pounds over a single day. Short term weight loss or gain becomes noise - but with repeated weighins, trends emerge. </p>
            <p>Take a look for yourself!</p>
            <h4 className="text-center">Weight Over Time</h4>
            <p>{myimage}</p>
            <br />

          </div>
          <div className="col-sm-4" >
            <div className="border" id="loginbox">
            <LoginForm />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-10 offset-1">
            <br />
            <hr />
            <div className="alert alert-danger"><strong>DISCLAIMER:</strong> To produce cool data, this app requires you to weigh yourself several times per day, which isn't everyone's idea of fun. Only use Data Body if you think you will be able to enjoy the information it provides without suffering negative mental health consequences. If you might develop a toxic obsession with the scale, turn back now!</div>
          </div>
        </div>

      </div>
    )
  }
}


class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

    this.state = {
      username: '',
      password: 'choose',
      activity: 'choose',
      height: '',
      age: '',
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
    if (this.state.activity === "choose") {
      this.setState({ error: 'You must set your physical activity level.' });
      return;
    }
    if (this.state.height === '' || this.state.age === '') {
      this.setState({ error: 'You must enter all data requested.' });
      return;
    }

    // no validation errors, so attempt to register:

    var registration = {};
    registration.username = this.state.username;
    registration.password = this.state.password;
    registration.email = "fake@email.com";
    registration.activity = this.state.activity;
    registration.height = this.state.height;
    registration.age = this.state.age;

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
            activity: 'choose',
            height: '',
            age: ''
          });
          return;
        } else {
          // process logging in the newly registered user
          sessionStorage.authed = "true";
          sessionStorage.username = res.username;
          this.setState({
            username: '',
            password: 'choose',
            activity: 'choose',
            height: '',
            age: '',
            error: ''
          });
        }
      })
      .catch(err => console.log(err));
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
            <label htmlFor="passwordinput">Password</label>
            <select
              className="form-control"
              id="passwordinput"
              name="password"
              onChange={this.handleFormChange}
              value={this.password} >
              <option value="choose">Choose...</option>
              <option value="123">123</option>
              <option value="abc">abc</option>
              <option value="pwd">pwd</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityinput">Average Physical Activity Level</label>
            <select
              className="form-control"
              id="activityinput"
              name="activity"
              onChange={this.handleFormChange}
              value={this.activity} >
              <option value="choose">Choose...</option>
              <option value="1">Sedentary: little or not exercise</option>
              <option value="2">Lightly Active: light exercise 1-3 times per week</option>
              <option value="3">Moderately Active: moderate exercise 3-5 times per week</option>
              <option value="4">Very active: hard exercise 6-7 days per week</option>
              <option value="5">Extremely active: phyiscal job, 2x training, athlete, etc.</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="heightinput">Height (inches)</label>
            <input
              className="form-control col-4"
              id="heightinput"
              name="height"
              type="number"
              min="45"
              max="102"
              step="0.5"
              placeholder="Height (inches)"
              value={this.state.height}
              onChange={this.handleFormChange} />
          </div>

          <div className="form-group">
            <label htmlFor="ageinput">Age</label>
            <input
              className="form-control col-4"
              id="ageinput"
              name="age"
              type="number"
              min="13"
              max="125"
              step="1"
              placeholder="Age (years)"
              value={this.state.age}
              onChange={this.handleFormChange} />
          </div>
          <br />



          <div className="text-center">
            <button type="submit" className="btn btn-lg btn-success" onClick={this.handleRegister}><i className="fa fa-handshake-o" aria-hidden="true"></i> Register</button>
          </div>
        </form>)
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
    <div className="col-4 offset-4">
      <LoginForm />
    </div>
  </div>
)

class Weigh extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

    this.state = {
      weight: '',
      message: '',
      username: sessionStorage.username,
      posted: false
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
    console.log(event.target.name);

    if (event.target.name === "fakeMyData") {
      console.log("Faking test data...");
      fetch('/fakemydata', { credentials: 'include', method: "GET" })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else { throw Error(res.statusTest) }
        })
        .then(res => {
          console.log("Server responds: ");
          console.log(res);
          this.setState({ weight: '', message: res, posted: true });
        })
        .catch(err => console.log(err));
    }

    // handle various registration error scenarios
    if (this.state.weight === '') {
      this.setState({ error: 'Enter weight' });
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
        this.setState({ weight: '', message: res, posted: true });
      })
      .catch(err => console.log(err));
  }
  // TODO: This is not responsive and BADLY broken on small displays. R.I.P.
  render() {
    if (this.state.posted) {
      return (<Redirect to={{ pathname: '/stats' }} />);
    }
    if (this.state.message) {
      var response_message = (<div className="alert alert-success"><strong>Success: </strong>{this.state.message}</div>);
    }
    else if (this.state.error) {
      var response_message = (<div className="alert alert-danger text-center"><strong>Error</strong> <p>{this.state.error}</p></div>);
    }
    else {
      var response_message = false;
    }
    return (
      <div className="row">
        <div className="col-sm-2 offset-5 text-center">
          {response_message}
          <form onSubmit={this.handleSubmit}>

            <h3>Weigh-in</h3>
            <br />
            <div className="card-deck">
              <div className="card border border-danger w-50" >
                <div className="card-body">

                  <div className="form-group">
                    <label htmlFor="weightinput"><span className="text-danger"><strong>Weight</strong></span></label>
                    <input
                      className="form-control"
                      id="weightinput"
                      name="weight"
                      type="number"
                      min="50"
                      max="500"
                      step="0.1"
                      placeholder="weight (lbs)"
                      value={this.state.weight}
                      onChange={this.handleFormChange} />
                  </div>

                  <div className="text-center">
                    <p><button
                      className="btn btn-warning"
                      name="Submit"
                      onClick={this.handleSubmit}><i className="fa fa-plus" aria-hidden="true"></i> Add</button></p>
                  </div>
                </div>

              </div>
            </div>

            <br />
            <hr />
            <div className="text-center">
              <h2>Demo</h2>
              <p>Load test data instead</p>
              <p>
                <button
                  className="btn btn-danger"
                  name="fakeMyData"
                  onClick={this.handleSubmit}><i className="fa fa-flask" aria-hidden="true"></i> Fake My Data</button></p>
            </div>


          </form>
        </div>
      </div>
    )
  }
}

class Stats extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.fetchWeightData = this.fetchWeightData.bind(this);

    this.state = {
      progress: -1,
      loading: true,
      data: {},
      status_message: "Loading...",
      alert_class: 'alert alert-info'
    }
  }

  handleDelete(event) {
    event.preventDefault;
    //alert("Woah deleting your data!");
    fetch('/deletemydata', { credentials: 'include', method: "GET" })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else { throw Error(res.statusTest) }
      })
      .then(res => {
        console.log("Server responds with data summary: ");
        console.log(res);
        if (res.error) {
          console.log(res.error_message);
          return;
        }
        this.fetchWeightData();
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchWeightData();
  }

  fetchWeightData() {
    // fetch data summary
    fetch('/userdatasummary', { credentials: 'include', method: "GET" })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else { throw Error(res.statusTest) }
      })
      .then(res => {
        console.log("Server responds with data summary: ");
        console.log(res);
        if (res.error) {
          console.log(res.error_message);
          return;
        }
        this.setState({
          loading: false,
          progress: res.progress,
          data: res,
          status_message: res.status_message,
          alert_class: res.alert_class,
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.loading) {
      var status_message = (<p><i className="fa fa-spinner fa-spin" style={{ fontSize: "20px" }}></i></p>);
    }
    else {
      var status_message = false;
    }
    var dashboard = false;


    // build the ASCII progress bar. Gamification!
    var dashboard = false;
    var progXs = parseInt(this.state.progress / 10);
    var spaces = 10 - progXs;
    var progressASCIIexes = "x ".repeat(progXs);
    var progressASCIIunderscores = "_ ".repeat(spaces);
    var color;
    if (progXs <= 3) {
      color = "red";
    }
    else if (progXs <= 6) {
      color = "orange"
    }
    else if (progXs <= 9) {
      color = "yellow"
    }
    else {
      color = "green"
    }

    var progressbar = (
      <div className="row">
        <div className="col-8 offset-2">
          <hr />
          <div className="text-center" id="progressbar" >
            <h4>Progress Bar ({this.state.progress}%)</h4>
            <p style={{ "fontFamily": "monospace", "fontSize": "32px", "fontWeight": "bold" }}>
              | <span style={{ "color": color }}>{progressASCIIexes}</span>{progressASCIIunderscores}|
          </p>
            <br />
          </div>
        </div>
      </div>);

    if (this.state.progress >= 100) {
      var dashboard = (<div className="row">
        <div className="col">
          <hr />
          <div className="card-deck">

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center">Calories</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">In and Out</h6>
                  <p className="card-text">
                    <strong>Daily Caloric Needs:</strong> {this.state.data.daily_kcal_needs} Kcal</p>
                  <p className="card-text">
                    <strong>Daily Caloric Expenditure:</strong> {this.state.data.daily_kcal_burn} Kcal</p>
                  <p className="card-text">
                    <strong>Daily Caloric Delta:</strong> {this.state.data.kcal_delta} Kcal  </p>


                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center">Weight</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">Current and Delta</h6>
                  <p className="card-text">
                    <strong>Weight:</strong> {this.state.data.cur_weight} pounds
                </p>
                  <p className="card-text">
                    <strong>Weight Change:</strong> {this.state.data.weight_delta} pounds per week   </p>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center">Goals</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">Squad and Otherwise</h6>
                  <p className="card-text">
                    <strong>To lose weight: </strong>  at [] Kcal / day
                </p>
                  <p className="card-text">
                    <strong>To gain weight:</strong> eat [] Kcal / day
                </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      )
    }

    return (
      <div>
        <div className="row">

          <div className="col-6 offset-3">
            <h2 className="text-center">Stats for {sessionStorage.username}</h2>
            <div className="text-center">
              {status_message}
            </div>
            <div className="text-center">
              <div className={this.state.alert_class}><strong>Data Status:</strong> {this.state.status_message} </div>
              <p> <strong>Height:</strong> {this.state.data.height} inches | <strong>Age:</strong> {this.state.data.age} years | <strong>Activity Level:</strong> ({this.state.data.activity}/5) </p>
              <br />
            </div>
          </div>

        </div>

        {dashboard}

        <br />
        {progressbar}
        <br />

        <div className="row text-center">
          <div className="col">
            <button className="btn btn-lg btn-warning">
              <Link to="/weigh" style={{ "color": "black" }}>
                <i className="fa fa-balance-scale" aria-hidden="true">
                </i> Weigh-in
            </Link></button>
          </div>
        </div>

        <div className="row text-center">


          <div className="col">
            <hr />
            <h4>Delete all my data</h4>
            <p>For testing, press this button to delete all of your weight data and clear fake test data</p>
            <button className="btn btn-danger" onClick={this.handleDelete}><i className="fa fa-trash-o" aria-hidden="true"></i> Delete My Data</button>
          </div>
        </div>



      </div >

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

    // TODO: Use redux next time. This is so hacky.
    setInterval(() => {
      // console.log("Login state sniffer");
      // console.log(sessionStorage.authed);
      if (sessionStorage.authed === "true") {
        this.setState({ authed: true });
      }
      else if (this.state.authed === true && sessionStorage.authed !== "true") {
        this.setState({ authed: false })
      }
    }, 100);


  }

  render() {
    // console.log("# # # Rendering the app!");
    return (
      <div className="App">
        <Router>
          <div>
            <main role="main" className="container">

              <Nav authed={this.state.authed} />
              <div className="jumbotron text-center">
                <h1>Data Body</h1>
                <h4>Calorie Data from Weight and Math</h4>
              </div>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/logout" render={() => {
                // TODO: Make this less hacky
                console.log("logout clicked, logging out...");
                sessionStorage.removeItem('authed');
                sessionStorage.removeItem('username');
                logoutFetch();
                return (<Redirect to="/login" />);
              }} />
              <PrivateRoute path="/weigh" component={Weigh} />
              <PrivateRoute path="/stats" component={Stats} />
              <br />
              <hr />
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
  )} />)


class Nav extends Component {
  render() {
    if (this.props.authed) {
      var logoutLink = (<li className="nav-item">
        <Link to="/logout" className="nav-link">
          <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
      </Link></li>);
      var weighinLink = (<li className="nav-item">
        <Link to="/weigh" className="nav-link"><i className="fa fa-balance-scale" aria-hidden="true"></i> Weigh-in
      </Link></li>);
      var statsLink = (<li className="nav-item">
        <Link to="/stats" className="nav-link"><i className="fa fa-user" aria-hidden="true"></i> Stats
        </Link></li>);

      var loginLink = false;
      var registerLink = false;
    }
    else {
      var weighinLink = false;
      var statsLink = false;
      var logoutLink = false;

      var registerLink = (<li className="nav-item">
        <Link to="/register" className="nav-link"><i className="fa fa-handshake-o" aria-hidden="true"></i> Register</Link>
      </li>);
      var loginLink = (<li className="nav-item">
        <Link to="/login" className="nav-link"><i className="fa fa-sign-in" aria-hidden="true"></i> Login</Link>
      </li>);
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
        <Link to="/" className="navbar-brand"><img src="databodylogosmall.jpg" alt="brand image" /></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mr-auto">
            {weighinLink}
            {statsLink}

          </ul>
          <ul className="navbar-nav">
            {registerLink}
            {loginLink}
            {logoutLink}
          </ul>
        </div>
      </nav>)
  }
}

function logoutFetch() {
  // fetch data summary
  console.log("Logging out");
  fetch('/logout', { credentials: 'include', method: "GET" })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else { throw Error(res.statusTest) }
    })
    .then(res => {
      console.log("Server responds with data summary: ");
      console.log(res);
    })
    .catch(err => console.log(err));
}
export default App;
