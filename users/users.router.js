const { Router } = require('express');
const {
  createUserSchema,
  updateSubscriptionSchema,
  loginSchema,
} = require('./userShemes');
const UserController = require('./users.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const validate = require('../helpers/validate');
const userControllerProxy = createControllerProxy(UserController);

const usersRouter = Router();

//* READ
usersRouter.get(
  '/users/current',
  userControllerProxy.authorize,
  userControllerProxy.getCurrentUser,
);

//* CREATE
usersRouter.post(
  '/auth/register',
  validate(createUserSchema),
  userControllerProxy.createUser,
);

usersRouter.patch(
  '/users/:userId',
  userControllerProxy.validateId,
  validate(updateSubscriptionSchema),
  userControllerProxy.updateUser,
);

usersRouter.patch(
  '/auth/login',
  validate(loginSchema),
  userControllerProxy.login,
);

usersRouter.patch(
  '/auth/logout',
  userControllerProxy.authorize,
  userControllerProxy.logout,
);

module.exports = usersRouter;
