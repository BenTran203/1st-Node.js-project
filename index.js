const fs = require('fs');
const http = require('http');

//======================================================================
// Synchronus file reading

 const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
  const dataObj = JSON.parse(data);
  });

//=====================================================================
// SERVER

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the overview");
  } 
  else if (pathName === "/product") {
    res.end("THIS IS THE PRODUCT");
  } 
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data); 
  } 
  else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "My-Header": "Hello World",
    });
    res.end("<h1>PAGE NOT FOUND!</h1>");
  }
});

// Starting the server
server.listen(8000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:8000/");
});
