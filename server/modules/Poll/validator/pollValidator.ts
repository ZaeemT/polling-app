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
