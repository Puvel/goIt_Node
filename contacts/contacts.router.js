const { Router } = require('express');
const { createContactSchema, updateContactSchema } = require('./contactShemes');
const ContactsController = require('./contacts.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const validate = require('../helpers/validate');
const contactControllerProxy = createControllerProxy(ContactsController);
const contactsRouter = Router();

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
