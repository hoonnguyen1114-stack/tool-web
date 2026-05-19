const Joi = require('joi');

const validateProcessRequest = (req, res, next) => {
  const schema = Joi.object({
    data: Joi.array().items(
      Joi.object({
        user: Joi.string().min(1).max(100).required(),
        pass: Joi.string().min(1).max(100).required()
      })
    ).min(1).max(10000).required(),
    rules: Joi.array().items(Joi.string()).min(1).required(),
    depth: Joi.number().min(1).max(4).default(1),
    maxResults: Joi.number().min(100).max(1000000).default(100000),
    chunkSize: Joi.number().min(100).max(5000).default(500)
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validated = value;
  next();
};

const validateCustomPatterns = (req, res, next) => {
  const schema = Joi.object({
    data: Joi.array().items(
      Joi.object({
        user: Joi.string().min(1).max(100).required(),
        pass: Joi.string().min(1).max(100).required()
      })
    ).min(1).max(10000).required(),
    prefixes: Joi.array().items(Joi.string().max(50)).default([]),
    suffixes: Joi.array().items(Joi.string().max(50)).default([]),
    separators: Joi.array().items(Joi.string().max(10)).default([]),
    maxResults: Joi.number().min(100).max(1000000).default(100000)
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validated = value;
  next();
};

module.exports = { validateProcessRequest, validateCustomPatterns };
