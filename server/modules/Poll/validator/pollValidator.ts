import Joi from "joi";

export const createPollValidator = Joi.object().keys({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    options: Joi.array()
        .items(Joi.string().min(1))
        .min(2)
        .max(5)
        .required()
        .messages({
            'array.min': 'Poll must have at least 2 options',
            'array.max': 'Poll can have a maximum of 5 options'
        })
});

export const updatePollValidator = Joi.object().keys({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    options: Joi.array()
        .items(Joi.string().min(1))
        .min(2)
        .max(5)
        .optional()
});

export const votePollValidator = Joi.object({
    option: Joi.string().required().messages({
        "string.base": `"option" should be a type of 'text'`,
        "string.empty": `"option" cannot be an empty field`,
        "any.required": `"option" is a required field`
    }),
    user_id: Joi.string().optional().messages({
        "string.base": `"user_id" should be a type of 'text'`
    }),
    ipAddress: Joi.string().optional().ip({ version: ['ipv4', 'ipv6'] }).messages({
        "string.base": `"ipAddress" should be a type of 'text'`,
        "string.ip": `"ipAddress" must be a valid IP address`
    })
});