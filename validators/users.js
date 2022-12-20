const Joi = require('joi');

const UserJoiSchema = Joi.object({
    name: Joi.string().min(3).max(256).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const AuthJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports.User = UserJoiSchema;
module.exports.Auth = AuthJoiSchema;