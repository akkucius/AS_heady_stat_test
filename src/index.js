// setting up mongodb connection
require("./db/mongodb.js");
const productRouter = require("./router/product.js");
const categoryRouter = require("./router/category.js");

// setting up default port
const port = process.env.PORT || 3000;

// setting up express
const express = require("express");

// setting up express
const app = express();
app.use(express.json());
app.use(productRouter);
app.use(categoryRouter);

// app listening on default port
app.listen(port, () => {
    console.log("App listening on " + port);
});

// base index page / system check
app.get("", (req, res) => {
    return res.send({
        info: "Welcome to Heady-Sat",
        syscheck: "Your server is up and running - " + new Date()
    });
});
