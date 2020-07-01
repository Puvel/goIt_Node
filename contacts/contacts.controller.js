const Joi = require('@hapi/joi');
const contactsMethods = require('./contacts');

class ContactsController {
  //*READ
  async getContacts(req, res, next) {
    try {
      const allContacts = await contactsMethods.listContacts();
      return res.status(200).json(allContacts);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    const { contactId } = req.params;
    try {
      const contact = await contactsMethods.getContactById(contactId);
      if (!contact) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  //*CREATE
  async createContact(req, res, next) {
    try {
      const createContact = await contactsMethods.addContact(req.body);
      return res.status(201).json(createContact);
    } catch (err) {
      next(err);
    }
  }

  //* DELITE
  async deliteContact(req, res, next) {
    const { contactId } = req.params;
    try {
      const deliteContact = await contactsMethods.removeContact(contactId);
      if (deliteContact) {
        return res.status(200).json({ message: 'contact deleted' });
      } else {
        return res.status(404).json({ message: 'Not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  //* UPDATE
  async updateContact(req, res, next) {
    const { contactId } = req.params;

    try {
      const chengeContact = await contactsMethods.editContact(
        contactId,
        req.body,
      );
      if (chengeContact) {
        return res.status(200).json(chengeContact);
      } else {
        return res.status(404).json({ message: 'Not found' });
      }
    } catch (err) {
      next(err);
    }
  }
  //* VALIDATE
  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send({ message: 'missing required name field' });
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).min(1);

    const result = updateContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send({ message: 'missing fields' });
    }

    next();
  }
}

module.exports = new ContactsController();
