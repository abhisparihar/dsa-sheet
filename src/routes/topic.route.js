import express from 'express';
import validate from '../middlewares/validate.js';
import topicController from '../controlers/topic.controller.js';
import topicValidation from '../validations/topic.validation.js';
import auth from '../middlewares/auth.js'

const router = express.Router();

router.route('/').get(auth(), topicController.topiclist);
router.route('/').post(auth(), validate(topicValidation.add), topicController.addTopic);
router.route('/add-multiple').post(auth(), validate(validate.addMultipleTopicsValidation), topicController.addMultipleTopics);

export default router;
