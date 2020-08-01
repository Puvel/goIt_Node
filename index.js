const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./contacts/contacts.router');
const usersRouter = require('./users/users.router');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabaseConnection();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  async initDatabaseConnection() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
      });
      console.log('Database connection successful');
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors({ origin: 'http://localhost:3000' }));
    this.server.use('/images', express.static('./public/images'));
  }

  initRoutes() {
    this.server.use('/', usersRouter);
    this.server.use('/contacts', contactsRouter);
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
};
