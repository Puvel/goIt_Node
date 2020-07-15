const contactModel = require('./contacts.model');
const {
  Types: { ObjectId },
} = require('mongoose');

class ContactsController {
  //*READ
  async getContacts(req, res, next) {
    const contacts = await contactModel.find();
    return res.status(200).json(contacts);
  }

  async getContactById(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactModel.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(contact);
  }

  //*CREATE
  async createContact(req, res, next) {
    const newContact = await contactModel.create(req.body);
    return res.status(201).json(newContact);
  }

  //* DELITE
  async deliteContact(req, res, next) {
    const { contactId } = req.params;
    const deliteContact = await contactModel.findByIdAndDelete(contactId);
    if (deliteContact) {
      return res.status(200).json({ message: 'contact deleted' });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  //* UPDATE
  async updateContact(req, res, next) {
    const { contactId } = req.params;
    console.log(contactId);
    const chengeContact = await contactModel.findContactByIdAndUpdate(
      contactId,
      req.body,
    );
    console.log(chengeContact);
    if (chengeContact) {
      return res.status(200).json(chengeContact);
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  //* VALIDATE
  validateId(req, res, next) {
    const { contactId } = req.params;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send('Not found');
    }
    next();
  }
}

module.exports = new ContactsController();
