const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const validators = require('../validators/livecodes');
const models = require('../models/livecodes');
const user_models = require('../models/users');
const mongoose = require('mongoose');
const utils = require('../utils');
const _  = require('lodash');


router.post('/', async (req, res) => {
    //validate the input
    const {value, error} = validators.LiveCodeExtendedMetadataJoiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);        
    
    //create and save the liveCode object in MongoDB
    var liveCode = new models.LiveCode({
        author: req.user,
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

router.get('/', async (req, res) => {    
    // validate filters
    const {value: filters, error} = validators.LiveCodeFiltersJoiSchema.validate(req.query);    
    if (error) return res.status(400).send(error.details[0].message);
    
    const fields = utils.extarctFieldsFilter(filters);

    if (filters.author) {
        if (filters.author === 'me') {
            if (!req.user) {
                return res.status(403).send("Unauthorized");
            }                
            filters.author = new mongoose.Types.ObjectId(req.user._id)
        } else {            
            const author = await user_models.User.findOne({name: filters.author});
            if (author) {
                filters.author = author._id;
            } else {
                // this will result in empty result-set
                filters.author = undefined;                
            }
        }
    }            
    try {
        result = await models.LiveCode.find(filters)
        .select({'git._id': false, '__v': false, 'video_versions': false, 'code_changes': false, 'finalized': false, 'published': false})
        .select(fields)
        .populate('author', 'name email -_id');
    } catch (ex) {
        console.log(ex.message);
        return res.status(500).send("Failed to read from DB");
    }     
    return res.status(201).send(result);
});


router.get('/:livecode_id', async (req, res) => {
    const {value: filters, error} = validators.LiveCodeFiltersJoiSchema.validate(req.query);    
    if (error) return res.status(400).send(error.details[0].message);    
    const fields = utils.extarctFieldsFilter(filters);
    var livecode = await models.LiveCode.find({ id: req.params.livecode_id,
        $or: [{published: true}, {author: req.user?._id}]})    
    .select({'git._id': false, '__v': false, 'video_versions': false, 'code_changes': false, 'finalized': false, 'published': false})
    .select(fields)
    .populate('author', 'name email -_id');    
    console.log(livecode);    
    if (livecode.length === 0) return res.status(404).send("Livecode not found.");    
    res.status(200).send(livecode[0]);

});

router.put('/:livecode_id', async (req, res) => {
    if (!req.user) return res.status(403).send("Unauthorized");

    const {value, error} = validators.LiveCodePutJoiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var livecode = await models.LiveCode.findById(req.params.livecode_id);
    if (!livecode) return res.status(404).send("Livecode not found.");

    if (livecode.author != req.user._id) return res.status(403).send("Unauthorized: not yours");

    if ("name" in value) livecode.name = value.name;
    if ("description" in value) livecode.description = value.description;
    if ("git" in value) livecode.git = value.git;    
    if ("finalized" in value) livecode.finalized = value.finalized;
    if ("published" in value) livecode.published = value.published;

    try {
        livecode = await livecode.save();
    } catch (ex) {
        console.log(ex.message);
        return res.status(500).send("Failed write to DB");
    }     
    return res.status(200).send(livecode);
});

router.delete('/:livecode_id', async (req, res) => {
    if (!req.user) return res.status(403).send("Unauthorized");

    var livecode = await models.LiveCode.findById(req.params.livecode_id);
    if (!livecode) return res.status(404).send("Livecode not found.");

    if (livecode.author != req.user._id) return res.status(403).send("Unauthorized: not yours");

    try {
        livecode = await livecode.delete();
    } catch (ex) {
        console.log(ex.message);
        return res.status(500).send("Failed delete in DB");
    }     
    return res.status(204).send(livecode);
    //63a1c320d38ab5c2691ac0cc
    //63a311f5f0564befc1e089b9
});


module.exports = router;