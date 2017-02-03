const util = require('util');
const http = require('http')
const port = 3000
const spawn = require('child_process').spawn;
const swipl = spawn('swipl', ['matchmaking.pl']);

var express = require('express')
var bodyParser = require("body-parser");
var app = express()

var responseString = "";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

swipl.stdout.on('data', (data) => {
    responseString = responseString + `${data}`;
    console.log(`${data}`);
  });

swipl.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

swipl.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

swipl.stdin.setEncoding('utf-8');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/addRequest', function(req, res){
  console.log(req.body);

  var playerId = req.body.playerId;
  var playerLevel = req.body.playerLevel;

  var playerString = util.format("assert(player(%s))", playerId)
  var playerLevelString = util.format("assert(level(%s, %s))", playerId, playerLevel)

  console.log(playerString);
  console.log(playerLevelString);

  swipl.stdin.write(playerString + ", " + playerLevelString + ".\n");

  res.send('Request accepted')
})

app.get('/listing', function(req, res){
  swipl.stdin.write("listing.\n");
  res.send("listed");
})

app.get('/match', function(req, res){
  console.log(req.query);
  responseString = "";

  var size = req.query.size || 2;
  var scoreThreshold = req.query.scoreThreshold || 1;

  swipl.stdin.write("\n");
  var queryString = util.format("match(Players, Score, %s, %s).\n", scoreThreshold, size);
  swipl.stdin.write(queryString);

  setTimeout(function(){
      res.send(responseString)
    }, 1000);
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})
/*
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello Node.js Server!')

  swipl.stdin.write("assert(will(rocks)).\n");
  swipl.stdin.write("will(X).\n");
  //swipl.stdin.write("assert(will(rocks))\n");
  //swipl.stdin.end(); /// this call seems necessary, at least with plain node.js executable
}

const server = http.createServer(requestHandler)
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log("server is listening on ${port}")
})
*/
