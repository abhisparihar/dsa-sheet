import express from 'express';
import validate from '../middlewares/validate.js';
import authValidation from '../validations/auth.validation.js';
import authController from '../controlers/auth.controller.js';

const router = express.Router();

router.route('/register').post(validate(authValidation.register), authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/logout').post(validate(authValidation.logout), authController.logout);

export default router;
