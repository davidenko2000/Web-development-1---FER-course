const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res) {
    const categories = (await db.query('SELECT * FROM categories')).rows;
    const inventory = (await db.query('SELECT * FROM inventory')).rows;

    for (let category of categories) {
        let newItems = inventory.filter(item => (item.categoryid === category.id));
        category.items = newItems;
    }

    res.render('order', {
        title: 'Order',
        linkActive: 'order',
        categories: categories,
    });
});

module.exports = router;