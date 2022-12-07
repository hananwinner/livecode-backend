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