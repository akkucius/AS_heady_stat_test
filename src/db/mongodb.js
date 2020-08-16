const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/heady-sat", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

var db = mongoose.connection;

module.exports = db;
