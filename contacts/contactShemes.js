const Joi = require('@hapi/joi');
//* SCHEMES
exports.createContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string().required(),
});

exports.updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
}).min(1);

exports.updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('free', 'pro', 'premium'),
});

exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
