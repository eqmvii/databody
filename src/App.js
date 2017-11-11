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


class NewLoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    if (sessionStorage.getItem('authed') === "true") {
      this.state = { loggedin: true };
    }
    else {
      this.state = { loggedin: false }
    }
  }

  handleLogin() {
    // alert("Login!");
    // TODO: Come back and make this less horrible
    sessionStorage.authed = "true";
    console.log(`Login clicked. Authed: ${sessionStorage.authed}`);
    this.setState({ loggedin: true });
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
      console.log("You are not logged in, so here's the login route");
      return (
        <form>
          <h3 className="text-center">Login</h3>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" />
              Check me out
              </label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <br />
          <button className="btn btn-danger" onClick={this.handleLogin}>Magic Login</button>
        </form>
      )
    }
  }
}

const LoginForm = () => (
  <form>
    <h3 className="text-center">Login</h3>
    <div className="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
      <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div className="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
    </div>
    <div className="form-check">
      <label className="form-check-label">
        <input type="checkbox" className="form-check-input" />
        Check me out
</label>
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>


)

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

    /*
    if (sessionStorage.getItem('authed') === "true") {
      this.state = { loggedin: true };
    }
    else {
      this.state = { loggedin: false }
    }
    */
  }

  handleRegister() {
    alert("Tryin' to register I see!");
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
      return (
        <form>
          <h3 className="text-center">Register</h3>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" />
              Check me out
              </label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <br />
          <button className="btn btn-danger" onClick={this.handleRegister}>Magic Register</button>
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

/*
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    if (sessionStorage.getItem('authed') === "true") {
      this.state = { loggedin: true };
    }
    else {
      this.state = { loggedin: false }
    }
  }

  handleLogin() {
    // alert("Login!");
    // TODO: Come back and make this less horrible
    sessionStorage.authed = "true";
    console.log(`Login clicked. Authed: ${sessionStorage.authed}`);
    this.setState({ loggedin: true });

  }

  render() {
    // console.log(this.props);
    console.log(`Rendering login route. Authed: ${sessionStorage.authed}. Redirect state: ${this.state.loggedin}`);

    if (this.state.loggedin) {
      console.log("You're logged in...");
      return (<Redirect to={{
        pathname: '/protected'
      }} />);
    }
    else {
      console.log("You are not logged in, so here's the login route");
      return (
        <div>
          <br />
          <h2>Hello! Welcome to LOGIN ROUTE. Login!</h2>
          <br />
          <button className="btn btn-primary" onClick={this.handleLogin}>Login</button>
        </div>
      )
    }
  }
}
*/

const Weighin = () => (
  <div className="row">
    <div className="col-6 offset-3">
    <h2>Enter Weight</h2>
    <input className="text-center"/>
    <button className="btn btn-primary disabled">Submit</button>
    </div>
  </div>
)

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
          <h2 className="text-center">Your Stats</h2>
          <ul>
            <li>user_id: </li>
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
                sessionStorage.setItem('authed', 'false');
                return (<Redirect to="/login" />);
              }} />
              <PrivateRoute path="/weighin" component={Weighin} />
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
          <Link to="/weighin" className="nav-link">Weigh</Link>
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
