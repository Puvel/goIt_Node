const userModel = require('./users.model');
const {
  Types: { ObjectId },
} = require('mongoose');
const { UnauthorizedError } = require('../helpers/errors.construcror');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  constructor() {
    this.costFactor = 6;
  }

  //*READ
  async getCurrentUser(req, res, next) {
    const [userResponse] = this.prepareUserResponse([req.user]);
    return res.status(200).json(userResponse);
  }

  //*CREATE
  async createUser(req, res, next) {
    const { email, password } = req.body;
    const uniqEmail = await userModel.findUserByEmail(email);
    if (uniqEmail) {
      return res.status(409).json({ message: 'Email in use' });
    }
    const passwordHash = await bcryptjs.hash(password, this.costFactor);
    const newUser = await userModel.create({
      ...req.body,
      password: passwordHash,
    });
    return res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  }

  //* UPDATE
  async updateUser(req, res, next) {
    const { userId } = req.params;
    const chengeUser = await userModel.findUserByIdAndUpdate(userId, req.body);
    if (chengeUser) {
      const [chengeUserForResponse] = this.prepareUserResponse([chengeUser]);
      return res.status(200).json(chengeUserForResponse);
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  //* AUTHORIZE
  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.replace('Bearer ', '');
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid email or password');
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60,
    });
    await userModel.updateToken(user._id, token);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
      },
    });
  }

  async logout(req, res, next) {
    const user = req.user;
    await userModel.updateToken(user._id, null);
    return res.status(204).send('No Content');
  }

  //* PREPARE-RESPONSE
  prepareUserResponse(users) {
    return users.map(user => {
      const { _id, email, subscription } = user;
      return { id: _id, email, subscription };
    });
  }

  //* VALIDATE
  validateId(req, res, next) {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send('Not found');
    }
    next();
  }
}

module.exports = new UserController();
