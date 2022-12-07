const express = require('express');
const router = express.Router();
const validators = require('./validators');
const models = require('./models');


router.post('/', async (req, res) => {
    //validate the input
    const {value, error} = validators.LiveCodeExtendedMetadataJoiSchema.validate(req.body);
    if (error) return res.status(400).send("Incorrect Request format");        
    
    //create and save the liveCode object in MongoDB
    var liveCode = new models.LiveCode({
        name: req.body.name,
        description: req.body.description,
        git: new models.GitMetadata({
            repository_url: req.body.git.repository_url,
            branch_name: req.body.git.branch_name
        })
    });
    try {
        liveCode = await liveCode.save();
    } catch(ex) {
        console.log(ex.message);
        return res.status(500).send("Cannot save to DB");
    }

    //return response (with the created object)
    return res.status(201).send(liveCode);
});

module.exports = router;