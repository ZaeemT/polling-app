import Joi from "joi";

const idSchema = Joi.string().hex().length(24);

export const validateIdParam = (req: any, res: any, next: any) => {
  const { id } = req.params;
  const validationResult = idSchema.validate(id);
  if (validationResult.error) {
    return res.status(400).json({ error: "Invalid id format" });
  }
  next();
};
