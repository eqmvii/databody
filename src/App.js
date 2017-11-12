// App.js - for DataBody, Eric Mancini's Node Knockout Hackathon Entry

// CURRENT STATUS:
/*
"Ready" to submit!
*/

import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'

// import images because of course it's javascript all the way down
import weightchart from './weightchart.png';
// image hacked together from a free logo generator at o'dark thirty
import databodylogosmall from './databodylogosmall.jpg';

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

          <h3 className="text-center text-danger">Login</h3>

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
    // seriously do it
  }

  render() {
    var myimage = (<img id="frontpagechart" src={weightchart} className="img-fluid img-thumbnail" alt="weight data chart" />);
    // disable image
    //myimage = false;
    return (
      <div>
        <div className="row">
          <div className="col-sm-8 border" id="mysplash">
            <h1 className="text-danger">Welcome!</h1>
            <p>How many calories do you consume?</p>
            <p>Data Body can tell you, without you needing to track what you eat! Of course there is one catch - you're going to need to weigh yourself several times per day, for several days. Once you've fed the app enough weight data, it will use Math to calculate how much you've been eating.</p>
            <div className="text-center">
              <p>
                <Link to="/register" style={{ "color": "white" }}>
                  <button className="btn btn-success">
                    <i className="fa fa-handshake-o" aria-hidden="true">
                    </i> Register
                  </button></Link></p>
            </div>
            <p>It will take several days to gatehr enough data. But if you can keep it up, you'll get data-driven feedback to help you gain, maintain, or lose weight!</p>
            <p>Just stepping on the scale now and then can give you a badly distorted idea of your progress, since a person's weight fluctuates several pounds over a single day. Short term weight loss or gain becomes noise - but with lots of data, trends emerge.</p>
            <p>Take a look at the below example of the method in action!</p>
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
              step="1"
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


const About = () => (
  <div className="row">
    <div className="col-sm-8 offset-2">
      <h1>About</h1><br />
      
      <p>
        Data Body was made by <a href="https://github.com/eqmvii">Eric Mancini</a> for the 2017 <a href="https://www.nodeknockout.com/">Node Knockout</a> 48-hour hackathon.
      </p>
      <br />
      <h3>The Premise</h3><br />
      <p>
        Given a large volume of data about a person's weight, simple linear regression and known <a href="https://en.wikipedia.org/wiki/Harris–Benedict_equation">equations</a> about metabolic rate can be used to approximate average caloric intake ("calories in") and metabolic rate ("calories out"). That's cool, because actually counting what you eat is a lot harder than just stepping on the scale a lot. Not everything has a good nutrition label, food scales get annoying to use quickly, etc.
      </p>

      <br />
      <h3>How it Works</h3><br />
      <p>
        After registering for an account, a user can only do one thing: enter their weight. When the weight is entered, it's added to a database with a time stamp. A thrilling ~gamified~ progress bar fills as you add data, and otherwise your numbers are out of sight, out of mind until there's sufficient data. Once The Algorithm has enough quality data, the Stats page will display average daily caloric information. In my experience it takes about 10 days worth of good data (around 30 points) for the equations to even out, but for fast testing purposes the app will show information as soon as it receives 10 data points.
      </p>

      <br />
      <h3>Background</h3><br />
      <p>
        Several years ago I had the idea to gather lots of weight data while trying to lose weight to see what those data looked like. The results surprised me - there was a huge fluctuation over the course of a single day! I kept tracking data, and also tracked what I ate, and found that with enough data the averages worked out beautifully: my weight loss was entirely accounted for by my activity level and caloric consumption. No surprise there, but it was a cool visual! Here's a chart from that experiment:
    </p>
      <p>
        <h4 className="text-center">Weight Over Time</h4>
        <img className="img-fluid img-thumbnail" src={weightchart} alt="scatterplot of weight data" />
      </p>

      <br />
      <h3>FAQ</h3><br />

      <ul>

        <li><strong>Will this work for everyone?</strong> Probably not. But it worked well enough for me when I tried it with excel that I've always wanted to make an app to automate the process.</li>
        <li><strong>Do you use the <a href="https://en.wikipedia.org/wiki/Harris–Benedict_equation">equation</a> for men or for women?</strong>An average of the two, for simplicity, and to avoid hacking together something with only a binary choice.</li>
        <li><strong>Linear regression won't work over the long term!</strong> Probably not. A better version of the app would limit the analysis to a medium time frame, like a few weeks. This is not that app.</li>
      </ul>

      <h3>Technical Details</h3><br />
      <p>
        The back-end is Node.js/Express/PostgreSQL plus a few helper libraries (express-session, regression, etc.). The front-end is React, via Create-React-App, with React-Router for routing and Bootstrap for styling.
      </p>
      <p>
        I probably should have used Redux but hacked something together using sessionStorage and duct tape and prayer instead. Lessons for next time!
      </p>

      <br />
      <h3>Bugs, Known Issues, and "Features"</h3><br />
      <p>
        As the product of a hackathon, a lot isn't quite right or could be expanded upon. Here's an incomplete list:
    </p>
      <ul>
        <li><strong>Testing time frame:</strong> Unfortunately the app doesn't really "work" without over a week of feeding it data, so it's hard to get a good sense for it in a single sitting. More buttons to simulate adding data was high on my "ran out of time to do it" list.</li>
        <li><strong>Data validation:</strong> There is very little. Also weights are accidentally stored as an integer in the DB but I wanted a decimal so they get multiplied by 10 going in and divided by 10 going out. Yes this is a quality codebase why thank you for noticing.</li>
        <li><strong>Units:</strong> The app only uses pounds and inches, unfortunately. TODO: add unit conversion for input and output.</li>
        <li><strong>Mobile/responsive design:</strong> Most of the app is broken on mobile/small screens. I was hoping it would work out-of-the box, but bootstrap V4 had other ideas and I ran out of time to fix it.</li>
     <li><strong>Back-end session storage:</strong> The back end lacks session storage and that's critically bad but oh hey look the hackathon is already over! Mistakes were made those accountable will be held responsible.</li>
     <li><strong>Cookies/browser storage: </strong> There are bugs. It is known.</li>
     <li><strong>Data editing:</strong> It would be nice to be able to delete or edit data. Rome wasn't built in a day!</li>
     <li><strong>Password security:</strong>Yeah. At least this way it's not a honeypot! Hashing, salting, etc. would be good.</li>
     <li><strong>Cell phone data entry:</strong> Using something like Twilio to allow for data entry by text message would be awesome!</li>
      <li><strong>Wow there are a lot of typos:</strong> Running out of time must deploy can't sleep clowns will eat me you're lucky I closed all of these HTML tags and the thing compiled ok?</li>
      </ul>

      <br />
      <h3>About me</h3><br />
      <p>
      I've been self-teaching coding and web design for about a year. This is my first hackathon, and my most ambitious node.js application to date. I am very tired and would like a nap.
      </p>
    </div>
  </div>

)

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
                    <label htmlFor="weightinput"><span className="text-danger"><strong>Your Weight</strong></span></label>
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

  // BUG / TODO: Not responsive, looks terrible on mobile, sorry!
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
    if (progXs <= 5) {
      color = "red";
    }
    else if (progXs <= 9) {
      color = "orange";
    }
    else {
      color = "green";
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
      var dashboard = (<div>
        <div className="row">
        <div className="col">
          <hr />
          <div className="card-deck">

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center text-danger">Daily Calories</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">burned and consumed</h6>

                  <br />
                  <p className="card-text">
                    At your activity level and size, you burn roughly <strong> {parseInt(this.state.data.daily_kcal_needs, 10).toLocaleString()} </strong> kcal per day.</p>
                  <p className="card-text">
                    Based on your weight data points, you consume an average of <strong> {parseInt(this.state.data.daily_kcal_burn, 10).toLocaleString()} </strong> kcal per day.</p>
                  <p className="card-text">
                    As a result, on average there is a <strong> {parseInt(this.state.data.kcal_delta, 10).toLocaleString()} </strong> kcal differential every day (for reference, there are about 3,500 kcal in a pound of fat).
                  </p>


                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center text-danger">Weight</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">based on averages</h6>

                  <br />
                  <p className="card-text text-center">
                    You weigh roughly:
                    </p>
                    <p className="card-text text-center">
                    <strong>{parseFloat(this.state.data.cur_weight).toLocaleString()} pounds</strong>
                    </p> 

                  <p className="card-text text-center">
                    Your weight changes by roughly:
                    </p>
                    <p className="card-text text-center">
                    <strong>{this.state.data.weight_delta} pounds per week </strong> 
                    </p>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card border border-danger" >
                <div className="card-body">
                  <h4 className="card-title text-center text-danger">Targets</h4>
                  <h6 className="card-subtitle mb-2 text-muted text-center">for weight gain or loss</h6>

                  <br />
                  <p className="card-text">
                    Consume around {parseInt(this.state.data.minus_a_pound, 10).toLocaleString()} Kcal per day to lose 1 pound per week.
                </p>
                  <p className="card-text">
                    Alternatively, consume around {parseInt(this.state.data.plus_a_pound, 10).toLocaleString()} Kcal per day to gain 1 pound per week.
                </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <br />
          <div class="alert alert-danger"><strong>Disclaimer:</strong> Your data will be CRAZY if you just entered 10 weights in a short burst, as it will be calculating daily/weekly averages based on just seconds worth of data. Kudos for giving in to the gamification, though! To get reasonable results/information, you will need 7-14 days worth of regular weigh-ins.</div>
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
            </div>
          </div>

        </div>

        {dashboard}

        <br />
        {progressbar}
        <br />

        <div className="row text-center">
          <div className="col">
            <Link to="/weigh" style={{ "color": "black" }}>
              <button className="btn btn-lg btn-warning">

                <i className="fa fa-tachometer" aria-hidden="true">
                </i> Weigh-in
            </button></Link>
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

// old routing example code
/*
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
*/

// old routing example
/*
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
)*/


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
                <h4>Transform easy-to-collect data into hard-to-know data. Alchemy!</h4>
              </div>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/About" component={About} />
              <Route path="/logout" render={() => {
                // TODO: Make this less hacky
                console.log("logout clicked, logging out...");
                sessionStorage.removeItem('authed');
                sessionStorage.removeItem('username');
                logoutFetch();
                return (<Redirect to="/" />);
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
          pathname: '/',
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
        <Link to="/weigh" className="nav-link"><i className="fa fa-tachometer" aria-hidden="true"></i> Weigh-in
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
        <Link to="/" className="navbar-brand"><img src={databodylogosmall} alt="brand image" /></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/about" className="nav-link"><i className="fa fa-info" aria-hidden="true"></i> About</Link>
            </li>
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
