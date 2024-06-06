const http = require('http');
const fs = require('fs');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObject = JSON.parse(data)

const templateReplace = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)

    if (!product.organic) {
        output = output.replace(/{%NOT-ORGANIC%}/, 'not-organic')
    }

    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf8");

const server = http.createServer((req, res) => {
    // query string
    const {query, pathname} = url.parse(req.url, true)
    console.log(query)

    //Overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {"Content-Type": "text/html"});

        const htmlCards = dataObject.map(elem => templateReplace(tempCard, elem)).join('')
        console.log(htmlCards)
        const output = tempOverview.replace(/{%PRODUCT-CARDS%}/g, htmlCards)

        res.end(output)
    }

    //Product page
    else if (pathname === "/product") {
        res.writeHead(200, {"Content-Type": "text/html"});
        const product = dataObject[query.id]
        const output = templateReplace(tempProduct, product)


        res.end(output)

        // API
    } else if(pathname === "/products") {
            res.writeHead(200, {
                "content-type": "application/json",
            })
            res.end(data)
        // Not found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        })
        res.end('<h1>"there is no page 404"</h1>')
    }

    console.log(req.url)
})

server.listen(8000, "127.0.0.1", () => {
    console.log("server was started on address: http://127.0.0.1:8000");
})

