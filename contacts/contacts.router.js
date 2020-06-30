const { Router } = require('express');
const ContactsController = require('./contacts.controller');

const contactsRouter = Router();

//* READ
contactsRouter.get('/', ContactsController.getContacts);
contactsRouter.get('/:contactId', ContactsController.getContactById);

//* CREATE
contactsRouter.post(
  '/',
  ContactsController.validateCreateContact,
  ContactsController.createContact,
);
//* DELITE
contactsRouter.delete('/:contactId', ContactsController.deliteContact);

//* UPDATE
contactsRouter.patch(
  '/:contactId',
  ContactsController.validateUpdateContact,
  ContactsController.updateContact,
);

module.exports = contactsRouter;
