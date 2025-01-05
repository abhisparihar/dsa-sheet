import express from 'express';
import validate from '../middlewares/validate.js';
import progressValidation from '../validations/progress.validation.js';
import progressController from '../controlers/progress.controller.js';
import auth from '../middlewares/auth.js'

const router = express.Router();

router.route('/complete').patch(auth(), validate(progressValidation.complete), progressController.complete);
router.route('/completed-subtopics').get(auth(), progressController.getCompletedSubtopics);
router.route('/').get(auth(), progressController.progress);

export default router;
