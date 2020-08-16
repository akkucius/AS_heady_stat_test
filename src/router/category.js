const express = require("express");
const conn = require("../db/mongodb.js");
const Category = require("../models/category.js");
const router = new express.Router();

// Add/Create category
router.post("/category", async (req, res) => {
    const category = new Category(req.body);
    try {
        await category.save();
        res.status(201).send(category);
    } catch (e) {
        // handling error and a check for duplicate entries
        if (e.code === 11000) {
            res.status(400).send({
                error:
                    "A duplicate entry for the given category, please try again with a different category name and try again"
            });
        } else {
            // we send all the other errors
            res.status(400).send(e);
        }
    }
});

// List out all the categories
router.get("/category", async (req, res) => {
    try {
        // dynamic category data
        const categoryData = [];

        // fetch all categories
        const allCategory = await Category.find({}).lean();

        // if no results then
        if (!allCategory) {
            res.status(404).send({ error: "No categories found..." });
        }

        // getting dynamic child categories
        for (let i = 0; i < allCategory.length; i++) {
            const childCategories = await findAllCategories([allCategory[i]]);
            categoryData.push(
                Object.assign({}, allCategory[i], {
                    child_categories: childCategories
                })
            );
        }
        res.send(categoryData);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Find all child categories for a given category
async function findAllCategories(stack) {
    var categoryNames = [];
    while (stack.length > 0) {
        const cnode = stack.pop();
        const child = await Category.find({
            parent: cnode.name
        });
        if (Array.isArray(child) && child.length > 0) {
            categoryNames.push(child[0].name);
            stack.push(child.pop());
        }
    }
    return Promise.resolve(categoryNames);
}

module.exports = router;
