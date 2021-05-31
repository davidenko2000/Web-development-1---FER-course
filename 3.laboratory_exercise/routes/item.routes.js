const express = require('express');
const router = express.Router();
const db = require('../db');

const {
    body,
    validationResult,
} = require('express-validator');


router.get('/:id([0-9]{1,3})', async function (req, res) {
    let id = parseInt(req.params.id);
    //const squery = (await db.query('SELECT categories.name as catName,category.seasonal, inventory.name as itemName, inventory.imageUrl, inventory.price, categories.description FROM categories JOIN inventory ON categories.id = inventory.categoryId AND inventory.id == $1', id)).rows;
    //console.log(squery);

    const categories = (await db.query('SELECT * FROM categories ')).rows;
    const items = (await db.query('SELECT * FROM inventory')).rows;
    const experts = (await db.query('SELECT * FROM experts')).rows;
    
    let itemExperts = experts.filter(expert => (expert.expertfor === id));
    let chosenItem;
    let chosenCategory;
    
    for (let item of items) {
        if(item.id === id){
            chosenItem = item;
            break;
        }
    }
    chosenItem.experts = itemExperts;
    for(let category of categories){
        if(category.id === chosenItem.categoryid){
            chosenCategory = category;
            break;
        }
    }

    res.render('item', {
        title: chosenItem.name,
        item : chosenItem,
        category: chosenCategory, 
        linkActive: 'order'
    });
});

router.get('/:id1([0-9]{1,3})/editexpert/:id2([0-9]{1,3})', async function (req, res) {
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    const items = (await db.query('SELECT * FROM inventory')).rows;
    const experts = (await db.query('SELECT * FROM experts')).rows;
    
    let chosenItem;
    for (let item of items) {
        if(item.id === id1){
            chosenItem = item;
            break;
        }
    }
    let chosenExpert;
    for (let expert of experts) {
        if(expert.id === id2){
            chosenExpert = expert;
            break;
        }
    }
    
    res.render('editExpert', {
        title: 'Edit Expert',
        linkActive: 'order',
        itemName: chosenItem.name,
        itemId: chosenItem.id,
        expert: chosenExpert
    });
});

router.post(
    '/:id1([0-9]{1,3})/editexpert/:id2([0-9]{1,3})',
    [
        body('name')
            .trim()
            .isLength({min: 4, max: 25}),
        body('surname')
        .trim()
        .isLength({min: 4, max: 25}),
        body('email')
            .trim()
            .isEmail(),
        body('employed')
            .trim()
            .isInt({min: 1975, max: 2021})
            .toInt(),
        body('expert')
        .trim()
        .isInt({min: 1975, max: 2021})
        .toInt(),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        let id1 = parseInt(req.params.id1);
        let id2 = parseInt(req.params.id2);

        //SVI fieldovi su mi null u bodyju i onda su prisutni svi errori

        if (!errors.isEmpty()) {
            res.render('error', {
                title: 'Edit Expert',
                linkActive: 'order',
                errors: errors.array(),
                itemID: id1,
            });
        } else {
            try {
                await db.query(
                    'UPDATE experts  SET name = $1, surname = $2, email = $3, employedsince = $4, expertsince= $5  WHERE id = $6',
                    [
                        req.body.name,
                        req.body.surname,
                        req.body.email,
                        req.body.employed,
                        req.body.expert,
                        id2,
                    ],
                );
                res.redirect('/item/' + id1);
            } catch (err) {
                res.render('error', {
                    title: 'Edit Expert',
                    linkActive: 'order',
                    errors: 'none',
                    errDB: err.message,
                    itemID: id1,
                });
            }
        }
    }
);



module.exports = router;