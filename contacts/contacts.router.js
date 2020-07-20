const { Router } = require('express');
const {
  createContactSchema,
  updateContactSchema,
  updateSubscriptionSchema,
  loginSchema,
} = require('./contactShemes');
const ContactsController = require('./contacts.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const validate = require('../helpers/validate');
const contactControllerProxy = createControllerProxy(ContactsController);
const contactsRouter = Router();

//* READ
contactsRouter.get('/contacts', contactControllerProxy.getContacts);
contactsRouter.get(
  '/contacts/:contactId',
  contactControllerProxy.validateId,
  contactControllerProxy.getContactById,
);
contactsRouter.get(
  '/users/current',
  contactControllerProxy.authorize,
  contactControllerProxy.getCurrentContact,
);

//* CREATE
contactsRouter.post(
  '/auth/register',
  validate(createContactSchema),
  contactControllerProxy.createContact,
);

//* DELITE
contactsRouter.delete(
  '/contacts/:contactId',
  contactControllerProxy.validateId,
  contactControllerProxy.deliteContact,
);

//* UPDATE
contactsRouter.patch(
  '/contacts/:contactId',
  contactControllerProxy.validateId,
  validate(updateContactSchema),
  contactControllerProxy.updateContact,
);

contactsRouter.patch(
  '/users/:contactId',
  contactControllerProxy.validateId,
  validate(updateSubscriptionSchema),
  contactControllerProxy.updateContact,
);

contactsRouter.patch(
  '/auth/login',
  validate(loginSchema),
  contactControllerProxy.login,
);

contactsRouter.patch(
  '/auth/logout',
  contactControllerProxy.authorize,
  contactControllerProxy.logout,
);

module.exports = contactsRouter;
