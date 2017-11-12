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
          // Store the session
          req.session.loggedin = true;
          req.session.username = registration.username;

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

// Temporarily populate app with fake data
app.get('/fakemydata', function (req, res) {
  console.log(`### FAKE MY DATA: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  if (!req.session.loggedin) {
    console.log("Error: Unauthorized GET fake-my-data request");
    res.json({
      error: true,
      error_message: "ERROR: Session error; unauthorized. Probably Eric's fault"
    });
    return;
  }
  // turn on the fake data flag
  req.session.fakedata = true;
  res.json({ error: false, error_message: '' });
});

// routes for testing purposes only
app.get('/logout', function (req, res) {
  console.log(`### Logout: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  req.session.loggedin = false;
  req.session.username = '';
  res.json("Logout complete");
});

// routes for testing purposes only
app.get('/deletemydata', function (req, res) {
  console.log(`### Delete My Data: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);

  // Check to see if username is already registered
  var name_check_query = "SELECT * FROM databody_users WHERE username = $1";
  var name_check_values = [username];
  // console.log(name_check_query + " . . . " + name_check_values[0]);

  client.query(name_check_query, name_check_values)


  res.json({ error: false, error_message: '' });

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
          login_response_object.error_message = "Login refused. Wrong pw and/or username.";
          login_response_object.error = true;
          res.json(login_response_object);
        }
      })
  });

});

app.post('/addweight', function (req, res) {
  console.log(`### ADD WEIGHT: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  if (!req.session.loggedin) {
    console.log("Error: Unauthorized add weight POST route request");
    res.json({
      error: true,
      error_message: "ERROR: Session error; unauthorized. Probably Eric's fault"
    });
    return;
  }
  // real data added, so turn off the fake data
  req.session.fakedata = false;
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
  console.log(`### USER DATA RAW: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  if (!req.session.loggedin) {
    console.log("Error: Unauthorized GET userdataraw route request");
    res.json({
      error: true,
      error_message: "ERROR: Session error; unauthorized. Probably Eric's fault"
    });
    return;
  }
  var username = req.session.username;
  var name_check_query = "SELECT * FROM databody_users WHERE username = $1";
  var name_check_values = [username];
  // console.log(name_check_query + " . . . " + name_check_values[0]);

  client.query(name_check_query, name_check_values)
    .then(resolve => {
      var userid = resolve.rows[0].userid;
      var query_string_insert = "SELECT * FROM databody_weights WHERE userid =$1";
      var values = [userid];
      console.log(query_string_insert);
      console.log(values);
      client.query(query_string_insert, values)
        .then(resolve => {
          res.json(resolve.rows);
        })

    });


});

app.get('/userdatasummary', function (req, res) {
  console.log(`### USER DATA SUMMARY: Loggedin: ${req.session.loggedin}, un: ${req.session.username}, #: ${req.session.mycounter}`);
  if (!req.session.loggedin) {
    console.log("Error: Unauthorized GET userdatasummary route request");
    res.json({
      error: true,
      error_message: "ERROR: Session error; unauthorized. Probably Eric's fault"
    });
    return;
  }

  var username = req.session.username;
  // if the fake-my-data flag is on, skip the function and respond with fake data
  if (req.session.fakedata) {
    var data_summary = {
      username: "Fake test data",
      userid: 0,
      height: 68,
      age: 30,
      activity: 2,
      weights: [],
      progress: 101,
      daily_kcal_needs: 1600,
      daily_kcal_burn: 2300,
      kcal_delta: 700,
      cur_weight: 145,
      weight_delta: -1.2,
      error: false,
      error_message: '',
      status_message: 'Fake Testing Data. Add a weight to turn off the fake data.'
    }
    res.json(data_summary);
    return;
  }

  var data_summary = {
    username: username,
    userid: -1,
    height: -1,
    age: -1,
    activity: -1,
    weights: [],
    progress: -1,
    daily_kcal_needs: -1,
    daily_kcal_burn: -1,
    kcal_delta: -1,
    cur_weight: -1,
    weight_delta: -1,
    error: false,
    error_message: '',
    status_message: ''
  }

  var name_check_query = "SELECT * FROM databody_users WHERE username = $1";
  var name_check_values = [username];

  client.query(name_check_query, name_check_values)
    .then(resolveUser => {
      // store user table data for response
      data_summary.userid = resolveUser.rows[0].userid;
      data_summary.height = resolveUser.rows[0].height;
      data_summary.age = resolveUser.rows[0].age;
      data_summary.activity = resolveUser.rows[0].activity;

      // Prepare to get weight data
      var weights_query = "SELECT * FROM databody_weights WHERE userid =$1";
      var values = [data_summary.userid];
      client.query(weights_query, values)
        .then(resolveWeights => {
          for (let i = 0; i < resolveWeights.rows.length; i++) {
            // prep data for linnear regression formula
            let weight_pair = {};
            weight_pair.stamp = resolveWeights.rows[i].stamp;
            weight_pair.weight = resolveWeights.rows[i].weight;
            data_summary.weights.push(weight_pair);
          }

          // TODO: Improve this formula
          data_summary.progress = parseInt((data_summary.weights.length / 10) * 100, 10);
          if (data_summary.progress > 100) {
            data_summary.progress = 100;
          }

          // calculate Harris Benedict Equation - BMR * activity factor

          // get user's weight history 

          // If less than 30 data points, return

          // If more than 30 data points, 

          // Run calculations on the resulting data:
          // y = mx + B

          // current weight

          res.json(data_summary);
        }); // end weights table then
    }); // end user table then
}); // end data summary route

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



