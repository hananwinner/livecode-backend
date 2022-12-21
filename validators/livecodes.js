const Joi = require('joi');
const { details, ValidationError } = require('joi/lib/errors');

const GitMetadataJoiSchema = Joi.object({
    repository_url: Joi.string().uri().required(),
    branch_name: Joi.string().required()
});

const LiveCodeExtendedMetadataJoiSchema = Joi.object({
    name: Joi.string().min(3).max(256).required(),
    description: Joi.string().min(3).max(1024).required(),
    git: GitMetadataJoiSchema,
    finalized: Joi.boolean(),
    published: Joi.boolean()
});

const LiveCodePutJoiSchema = Joi.object({
    name: Joi.string().min(3).max(256),
    description: Joi.string().min(3).max(1024),
    git: GitMetadataJoiSchema,
    finalized: Joi.boolean(),
    published: Joi.boolean()
});

const LiveCodeFiltersJoiSchema = Joi.object({
    author: Joi.string().min(2).max(256),
    published: Joi.boolean(),
    fields: Joi.string().regex(/^\w+$|^(\w+,)+\w*$/)    
    .custom((fields) => {
        var result = ''
        const possible_fields = ['published', 'finalized', 'video_versions', 'code_changes']
        const input_fields = fields.split(',');
        input_fields.forEach( (f) => {
            if (possible_fields.indexOf(f) > -1) {
                if (!(result === '')) {
                    result += ' ';
                }
                result += f;
            }
        });
        return result;
    } ).messages({        
        "string.pattern.base": "fields must be comma-separated string without spaces"
      })
});

module.exports.LiveCodeExtendedMetadataJoiSchema = LiveCodeExtendedMetadataJoiSchema;
module.exports.LiveCodeFiltersJoiSchema = LiveCodeFiltersJoiSchema;
module.exports.LiveCodePutJoiSchema = LiveCodePutJoiSchema;
