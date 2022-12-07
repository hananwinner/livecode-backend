const express = require('express');
const router = express.Router();
const validators = require('./validators');


router.post('/', async (req, res) => {
    //validate the input
    const {value, error} = validators.LiveCodeExtendedMetadataJoiSchema.validate(req.body);
    if (error) return res.status(400).send("Incorrect Request format");        
    
    //create and save the liveCode object in MongoDB
    //return response (with the created object)
});