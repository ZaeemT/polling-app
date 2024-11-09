import Joi from "joi";

export const loginValidator = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const registerValidator = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})