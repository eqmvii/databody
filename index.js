const express = require('express');
const helmet = require('helmet');
const expressEnforcesSSL = require('express-enforces-ssl');
const PORT = process.env.PORT || 3001;
const { Client } = require('pg');

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

// Initialize an express app with some security defaults
app
  .use(https)
  .use(helmet());

// Application-specific routes
// Add your own routes here!
app.get('/example-path', async (req, res, next) => {
  res.json({ message: "Hello NKO World! This text came from the server. Woah!" });
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
  res.status(500).send('something went wrong');
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
