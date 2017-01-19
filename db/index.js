let pg = require ('pg');
let postgresURL = 'postgress://localhost/twitterdb';
let client = new pg.Client(postgresURL);

///////////////////////


// connect to our database
client.connect(function (err) {
  if (err) throw err;

  // execute a query on our database
  client.query('SELECT $1::text as name', ['brianc'], function (err, result) {
    if (err) throw err;

    // just print the result to the console
    console.log(result.rows[0]); // outputs: { name: 'brianc' }

    // disconnect the client
    client.end(function (err) {
      if (err) throw err;
    });
  });
});


module.exports = client;
