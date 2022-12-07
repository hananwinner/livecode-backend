const express = require('express');
const router = express.Router();
const Joi = require('joi');


const GitMetadataJoiSchema = Joi.object({
    repository_url: Joi.string().uri().required(),
    branch_name: Joi.string().required()
});

const LiveCodeExtendedMetadataJoiSchema = Joi.object({
    name: Joi.string().min(3).max(256).required(),
    description: Joi.string().min(3).max(1024).required(),
    git: GitMetadataJoiSchema
});

router.post('/', async (req, res) => {
    //validate the input
    const {value, error} = LiveCodeExtendedMetadataJoiSchema.validate(req.body);
    if (error) return res.status(400).send("Incorrect Request format");        
    



//create and save the liveCode object in MongoDB
//return response (with the created object)
});