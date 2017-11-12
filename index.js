const express = require('express');
const helmet = require('helmet');
const expressEnforcesSSL = require('express-enforces-ssl');
const { Client } = require('pg');
const session = require('express-session');

// TODO: Add express-session to protect routes

const PORT = process.env.PORT || 3001;

// configure database connection based on environment
if (PORT === 3001) {
  var client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
  });
}
else {
  var client = new Client({ connectionString: process.env.DATABASE_URL, SSL: true });
}

client.connect();

// test the connection; TODO: Remove from production code
client.query('SELECT * FROM test_table;', (err, res) => {
  if (err) throw err;
  console.log("Succesfully read the following data from the PostgreSQL test_table: ");
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

const app = express();

// trying to get cookies to persist
app.set('trust proxy', true);

// TODO: Think about the providence of secure cookies
// TODO: pick a session store
// no security when running locally
if (PORT === 3001) {
  app.use(session({
    secret: 'this-is-NOT-a-secret-token-and-I-Know-It',
    cookie: { maxAge: 60 * 20 * 1000, secure: false },
    resave: true,
    saveUninitialized: true
  }));
}

else {
  app
    .use(https)
    .use(helmet());

  app.use(session({
    secret: 'this-is-NOT-a-secret-token-and-I-Know-It',
    cookie: { maxAge: 60 * 20 * 1000, secure: true },
    resave: true,
    saveUninitialized: true
  }));
}

// lots of security when running on heroku
app.use(function (req, res, next) {
  if (!req.session.mycounter) {
    req.session.mycounter = 1;
  }
  else { req.session.mycounter += 1 }
  // console.log("pass-through middleware:");
  // console.log(req.sessionID);

  // console.log(`Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  next();
});


// Access the session as req.session
app.get('/clapon', function (req, res, next) {
  var sessData = req.session;
  sessData.someAttribute = "foo";
  res.send('Returning with some text');
});

app.get('/clapoff', function (req, res, next) {
  var someAttribute = req.session.someAttribute;
  res.send(`This will print the attribute I set earlier: ${someAttribute}`);
});

// Application-specific routes
app.get('/example-path', async (req, res, next) => {
  res.json({ message: "Hello NKO World! This text came from the server. Woah!" });
});

app.post('/register', function (req, res) {
  // Check to see if username is already taken
  console.log("### REGISTER ###");
  var register_response_object = {
    duplicate: false,
    username: ''
  }

  // node.js boiilterplate for handling a body stream from PUT
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    var registration = JSON.parse(body);
    console.log("Registration details :");
    console.log(registration);
    register_response_object.username = registration.username;
    // TODO: Use ES6 syntax here

    // Check to see if username is already registered
    var name_check_query = "SELECT * FROM databody_users WHERE username = $1";
    var name_check_values = [registration.username];
    // console.log(name_check_query + " . . . " + name_check_values[0]);

    client.query(name_check_query, name_check_values)
      .then(resolve => {
        if (resolve.rows.length > 0) {
          console.log("User already registered.");
          register_response_object.duplicate = true;
          res.json(register_response_object);
        }
        else {
          console.log("It's a unique username, and I can register it!");
          // TODO: store to session
          var query_string_insert = "INSERT INTO databody_users (username, password, email, activity, height, age) VALUES ($1, $2, $3, $4, $5, $6)";
          var insert_values = [registration.username, registration.password, registration.email, registration.activity, registration.height, registration.age];
          console.log(query_string_insert);
          console.log(insert_values);
          client.query(query_string_insert, insert_values);

          // respond that there was no duplicate and the user was registered
          res.json(register_response_object);
        }
      })
  });

}); // end register route

// routes for testing purposes only
app.get('/getallusers', function (req, res) {
  console.log(`### GET ALL USERS: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  
  // console.log("Get messages endpoint hit");
  client.query('SELECT * FROM databody_users ORDER BY username', (err, response) => {
    if (err) throw err;
    res.json(response.rows);
  });
});

// routes for testing purposes only
app.get('/getallweights', function (req, res) {
  console.log(`### GET ALL WEIGHTS: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  client.query('SELECT * FROM databody_weights ORDER BY stamp', (err, response) => {
    if (err) throw err;
    res.json(response.rows);
  });
});



app.post('/login', function (req, res) {
  console.log(`### Login: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  console.log(req.sessionID);

  // console.log("### LOGIN ###");
  var login_response_object = {
    error: false,
    username: '',
    error_message: 'Login succeeded!',
  }

  // node.js boiilterplate for handling a body stream from PUT
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    body = JSON.parse(body);
    // console.log("Login request:");
    // console.log(body.username + " / " + body.password);
    login_response_object.username = body.username;
    // TODO: Use ES6 syntax here

    // Check to see if username is already registered
    var login_query = "SELECT * FROM databody_users WHERE username = $1 AND password = $2";
    var login_values = [body.username, body.password];
    // console.log(login_query + " . . . " + login_values[0] + ", " + login_values[1]);

    client.query(login_query, login_values)
      .then(resolve => {
        if (resolve.rows.length > 0) {
          // console.log("Username/password match!");
          req.session.loggedin = true;
          req.session.username = body.username;
          res.json(login_response_object);
        }
        else {
          // console.log("Username/password mismatch!");
          login_response_object.error_message = "Error: Your login didn't work";
          login_response_object.error = true;
          res.json(login_response_object);
        }
      })
  });

});

app.post('/addweight', function (req, res) {
  console.log(`### ADD WEIGHT: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  if(!req.session.loggedin){
    console.log("Error: Unauthorized add weight POST route request");
    res.json("ERROR: Session error; unauthorized. Probably Eric's fault");
    return;
  }
  // node.js boiilterplate for handling a body stream from PUT
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    body = JSON.parse(body);
    console.log("Weight datapoint:");
    console.log(body);
    var username = body.username;
    var weight = parseInt(body.weight, 10);

    // Check to see if username is already registered
    var name_check_query = "SELECT * FROM databody_users WHERE username = $1";
    var name_check_values = [username];
    // console.log(name_check_query + " . . . " + name_check_values[0]);

    client.query(name_check_query, name_check_values)
      .then(resolve => {
        var userid = resolve.rows[0].userid;
        var query_string_insert = "INSERT INTO databody_weights (userid, weight) VALUES ($1, $2)";
        var insert_values = [userid, weight];
        console.log(query_string_insert);
        console.log(insert_values);
        client.query(query_string_insert, insert_values);
        // respond that there was no duplicate and the user was registered
        res.json("Data added!");
      });
  });

}); // end add weight

app.get('/userdataraw', function (req, res) {
  // return the user's raw weight data
  console.log("### USERDATARAW ###");


  res.json({ message: "userdataraw route not implemented yet" });
});

app.get('/userdatasummary', function (req, res) {
  // process and return information about the user
  console.log("### USERDATASUMMARY ###");
  res.json({ message: "userdatasummary route not implemented yet" });

});

// Serve static assets built by create-react-app
app.use(express.static('build'));

/*
// If no explicit matches were found, serve index.html
app.get('*', function (req, res) {
  console.log(`### No match: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  
  res.sendFile(__dirname + '/build/index.html');
});
*/

app
  .use(notfound)
  .use(errors);

function https(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https' || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get('Host')}${req.originalUrl}`);
  } else {
    return next();
  }
}

function notfound(req, res, next) {
  res.status(404).send('Not Found');
}

function errors(err, req, res, next) {
  console.log(err);
  res.status(500).send('Error: something went wrong. Hackathon, nobody knows, etc.');
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));



