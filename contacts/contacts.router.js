const { Router } = require('express');
const Joi = require('@hapi/joi');
const ContactsController = require('./contacts.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const validate = require('../helpers/validate');
const contactControllerProxy = createControllerProxy(ContactsController);
const contactsRouter = Router();

//* SCHEMES
const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
}).min(1);

//* READ
contactsRouter.get('/', contactControllerProxy.getContacts);
contactsRouter.get(
  '/:contactId',
  contactControllerProxy.validateId,
  contactControllerProxy.getContactById,
);

//* CREATE
contactsRouter.post(
  '/',
  validate(createContactSchema),
  contactControllerProxy.createContact,
);

//* DELITE
contactsRouter.delete(
  '/:contactId',
  contactControllerProxy.validateId,
  contactControllerProxy.deliteContact,
);

//* UPDATE
contactsRouter.patch(
  '/:contactId',
  contactControllerProxy.validateId,
  validate(updateContactSchema),
  contactControllerProxy.updateContact,
);

module.exports = contactsRouter;
