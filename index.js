const fs = require('fs');
const http = require('http');

// Function to replace placeholders in template
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

// Reading templates and data
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Creating server
const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    // Generate HTML for each card
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    
    // Insert cardsHtml into tempOverview
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } 

  // Product page
  else if (pathName.startsWith("/product")) {
    res.writeHead(200, { "Content-Type": "text/html" });

    // Extract product ID from query string (e.g., /product?id=0)
    const productId = new URL(`http://localhost${pathName}`).searchParams.get("id");
    const product = dataObj[productId];
    
    // Generate product page if product exists
    if (product) {
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.end("<h1>Product not found!</h1>");
    }
  }

  // API route
  else if (pathName === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data); 
  } 

  // 404 Not Found
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
