const express = require('express');
const router = express.Router();
const models = require('../models/users');
const validators = require('../validators/users');
const _  = require('lodash');
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    const {value, error} = validators.User.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var user = await models.User.findOne({email: req.body.email});
    if (user) return res.status(400).send("User with this email is already registered.");

    user = _.pick(req.body, ['name', 'email', 'password'])
    const salt = await bcrypt.genSalt(10);    
    console.log(salt);
    user.password = await bcrypt.hash(user.password, salt);
    console.log(user.password);
    user = new models.User(user);        
    try {
        user = await user.save();    
        console.log(user);
        const token = user.generateAuthToken(); 
        return res.header('x-auth-token', token).status(201).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(ex) {
        console.log(ex);
        return res.status(500).send("failed DB");
    }    
});

router.post('/auth', async (req, res) => {
    const {value, error} = validators.Auth.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await models.User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("invalid email or password");

    console.log(user);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("invalid email or password");        

    console.log(user);
    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;