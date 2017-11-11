const express = require('express');
const helmet = require('helmet');
const expressEnforcesSSL = require('express-enforces-ssl');
const { Client } = require('pg');
// TODO: Add express-session to protect routes

const PORT = process.env.PORT || 3001;

// configure database connection based on environment
if (PORT === 3001) {
  var client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,});
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

// configuration for Heroku / enforce ssl
// app.enable('trust proxy');
// app.use(expressEnforcesSSL);

// Initialize an express app with some security defaults
app
  .use(https)
  .use(helmet());

// Application-specific routes
app.get('/example-path', async (req, res, next) => {
  res.json({ message: "Hello NKO World! This text came from the server. Woah!" });
});

app.post('/register', function (req, res) {
  // Check to see if username is already taken

  // If not, register the user

});

// routes for testing purposes only
app.get('/getallusers', function (req, res) {
  // console.log("Get messages endpoint hit");
  client.query('SELECT * FROM databody_users ORDER BY username', (err, response) => {
      if (err) throw err;
      res.json(response.rows);
  });
});

// routes for testing purposes only
app.get('/getallweights', function (req, res) {
  // console.log("Get messages endpoint hit");
  client.query('SELECT * FROM databody_weights ORDER BY stamp', (err, response) => {
      if (err) throw err;
      res.json(response.rows);
  });
});

app.post('/login', function (req, res) {
  // check to see if user name and password match

  //if so, yay!
});

app.post('/addweight', function (req, res) {
  // Add a single piece of new weight data to the weights table
});

app.get('/userdataraw', function (req, res) {
  // return the user's raw weight data
  res.json({ message: "userdataraw route not implemented yet" });  
});

app.get('/userdatasummary', function (req, res) {
  // process and return information about the user
  res.json({ message: "userdatasummary route not implemented yet" });  
  
});

// Serve static assets built by create-react-app
app.use(express.static('build'));


// If no explicit matches were found, serve index.html
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

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
