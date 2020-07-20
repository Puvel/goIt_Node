const contactModel = require('./contacts.model');
const {
  Types: { ObjectId },
} = require('mongoose');
const { UnauthorizedError } = require('../helpers/errors.construcror');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class ContactsController {
  constructor() {
    this.costFactor = 6;
  }

  //*READ
  async getContacts(req, res, next) {
    const { sub = null, page = null, limit = null } = req.query;
    if (sub) {
      const contacts = await contactModel.find({ subscription: req.query.sub });
      return res.status(200).json(this.prepareContactsResponse(contacts));
    }
    if (page && limit) {
      const options = {
        page,
        limit,
      };
      const contacts = await contactModel.paginate({}, options);
      return res.status(200).json(this.prepareContactsResponse(contacts.docs));
    }
    const contacts = await contactModel.find();
    return res.status(200).json(this.prepareContactsResponse(contacts));
  }

  async getContactById(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactModel.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }

    const [contactResponse] = this.prepareContactsResponse([contact]);
    return res.status(200).json(contactResponse);
  }

  async getCurrentContact(req, res, next) {
    const [contactResponse] = this.prepareContactsResponse([req.contact]);
    return res.status(200).json(contactResponse);
  }

  //*CREATE
  async createContact(req, res, next) {
    const { email, password } = req.body;
    const uniqEmail = await contactModel.findContactByEmail(email);
    if (uniqEmail) {
      return res.status(409).json({ message: 'Email in use' });
    }
    const passwordHash = await bcryptjs.hash(password, this.costFactor);
    const newContact = await contactModel.create({
      ...req.body,
      password: passwordHash,
    });
    return res.status(201).json({
      contact: {
        id: newContact._id,
        email: newContact.email,
        subscription: newContact.subscription,
      },
    });
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
    const chengeContact = await contactModel.findContactByIdAndUpdate(
      contactId,
      req.body,
    );
    if (chengeContact) {
      const [chengeContactForResponse] = this.prepareContactsResponse([
        chengeContact,
      ]);
      return res.status(200).json(chengeContactForResponse);
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  //* AUTHORIZE
  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.replace('Bearer ', '');
      let contactId;
      try {
        contactId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const contact = await contactModel.findById(contactId);
      if (!contact || contact.token !== token) {
        throw new UnauthorizedError();
      }
      req.contact = contact;
      req.token = token;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const contact = await contactModel.findContactByEmail(email);
    if (!contact) {
      return res.status(401).send('Invalid email or password');
    }
    const isValidPassword = await bcryptjs.compare(password, contact.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid email or password');
    }
    const token = await jwt.sign({ id: contact._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60,
    });
    await contactModel.updateToken(contact._id, token);
    return res.status(200).json({
      token,
      contact: {
        email: contact.email,
        subscription: contact.subscription,
      },
    });
  }

  async logout(req, res, next) {
    const contact = req.contact;
    await contactModel.updateToken(contact._id, null);
    return res.status(204).send('No Content');
  }

  //* PREPARE-RESPONSE
  prepareContactsResponse(contacts) {
    return contacts.map(contact => {
      const { _id, name, email, phone, subscription } = contact;
      return { id: _id, name, email, phone, subscription };
    });
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
