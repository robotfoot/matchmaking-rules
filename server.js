// content of index.js
const http = require('http')  
const port = 3000
const spawn = require('child_process').spawn;
//const swipl = spawn('swipl', ['-lh', '/usr']);
const swipl = spawn('swipl', ['matchmaking.pl']);

swipl.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

swipl.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

swipl.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

swipl.stdin.setEncoding('utf-8');
//swipl.stdout.pipe(process.stdout);

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
