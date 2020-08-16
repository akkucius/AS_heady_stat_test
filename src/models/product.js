const mongoose = require("mongoose");
const validator = require("validator");

const Product = mongoose.model("products", {
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    price: {
        type: mongoose.SchemaTypes.Decimal128,
        default: 0,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Price must be a postive number");
            }
        }
    },
    sku: {
        type: String,
        trim: true,
        default: ""
    },
    category: {
        type: [],
        trim: true,
        default: []
    },
    created: {
        type: Date
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports = Product;
