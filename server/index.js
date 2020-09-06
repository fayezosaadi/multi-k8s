const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const redis = require("redis");

const keys = require('./conf/keys')

// Express App Setup
const port = 5000
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`))

// Postgres Client Setup
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  database: keys.pgDatabase,
  password: keys.pgPassword,
});
pgClient.connect((err, client, release) => {
  if (err) return console.error('Error acquiring client', err.stack)
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) return console.error('Error executing query', err.stack)
    console.log(result.rows)
  })
  client.query('CREATE TABLE IF NOT EXISTS values (number INT unique)')
    .catch(err => console.log(err))
})

// Redis Client Setup
const redisClient = redis.createClient({ host: keys.redisHost, port: keys.redisPort });
const redisPublisher = redisClient.duplicate();

// Express APIs route handles
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/values/all', async (req, res) => {
  try {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
  } catch (e) {
    console.error(e)
  }
});
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
})

app.post('/values', async (req, res) => {
  const index = req.body.index;
  // if (numberExists(index)) return res.status(422).send('Number has already been computed')
  if (parseInt(index) > 40) return res.status(422).send('Index too high')
  redisPublisher.publish('insert', index);

  try {
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
    res.send(({ working: true }))
  } catch (e) {
    console.error(e)
  }
})
