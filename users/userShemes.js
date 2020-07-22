const Joi = require('@hapi/joi');
//* SCHEMES
exports.createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  subscription: Joi.string(),
  password: Joi.string().required(),
});

exports.updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('free', 'pro', 'premium'),
});

exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
