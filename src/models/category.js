const mongoose = require("mongoose");
const validator = require("validator");

const Category = mongoose.model("category", {
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    parent: {
        type: String,
        trim: true,
        index: true,
        default: ""
    },
    order: {
        type: Number,
        trim: true,
        default: 1
    }
});

module.exports = Category;
