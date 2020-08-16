const express = require("express");
const Product = require("../models/product.js");
const Category = require("../models/category.js");
const router = new express.Router();

// Add/Create products
router.post("/products", async (req, res) => {
    // set created date for the first time
    req.body.created = Date.now();

    // assign the Product schema with the request params
    const product = new Product(req.body);

    // get all product category(s)
    const productCategory = req.body.category;

    // save and check for any error
    try {
        const checkExistingCategory = await Category.find({
            name: { $in: productCategory }
        });
        // if mapped product categories are not equala to existing categories then throw an error
        if (productCategory.length !== checkExistingCategory.length) {
            res.status(400).send({
                error:
                    "Invalid category being mapped with product, please add valid category(s) to the product"
            });
        }

        await product.save();
        res.status(201).send(product);
    } catch (e) {
        // handling error and a check for duplicate entries
        if (e.code === 11000) {
            res.status(400).send({
                error:
                    "A duplicate entry for the given product, please try again with a different product name and try again"
            });
        } else {
            // we send all the other errors
            res.status(400).send(e);
        }
    }
});

// Update product details
router.patch("/products/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "price", "sku", "category"];
    const isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid product updates!" });
    }
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    } catch (e) {
        res.status(400).send(e);
    }
});

// products filter by category
router.get("/products", async (req, res) => {
    // category filter and error check
    const category = req.body.category;
    if (!category) {
        return res
            .status(404)
            .send({ error: "Invalid category, please enter a valid category" });
    }

    try {
        const product = await Product.find({ category: { $in: category } });
        if (!product || product.length === 0) {
            return res.status(404).send({
                error: "No products found for category - " + category
            });
        }

        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
