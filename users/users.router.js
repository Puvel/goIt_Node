const { Router } = require('express');
const {
  createUserSchema,
  updateSubscriptionSchema,
  loginSchema,
} = require('./userShemes');
const UserController = require('./users.controller');
const { createControllerProxy } = require('../helpers/controllers.proxy');
const validate = require('../helpers/validate');
const multer = require('multer');
const path = require('path');
const { avatarMin } = require('./users.middleware');
const { v4: uuidv4 } = require('uuid');
const userControllerProxy = createControllerProxy(UserController);
const usersRouter = Router();

const storage = multer.diskStorage({
  destination: './tmp',
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);
    return cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage });

//* READ
usersRouter.get(
  '/users/current',
  userControllerProxy.authorize,
  userControllerProxy.getCurrentUser,
);

//* CREATE
usersRouter.post(
  '/auth/register',
  upload.single('avatar'),
  validate(createUserSchema),
  userControllerProxy.createUser,
);

//* UPDATE
usersRouter.patch(
  '/users/:userId',
  userControllerProxy.validateId,
  validate(updateSubscriptionSchema),
  userControllerProxy.updateUser,
);

usersRouter.patch(
  '/users/avatars',
  userControllerProxy.authorize,
  upload.single('avatar'),
  avatarMin,
  // userControllerProxy.updateAvatar,
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
