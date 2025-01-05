import Joi from 'joi';
import { objectId } from './custom.validation.js';

const complete = {
    body: Joi.object().keys({
        subtopicId: Joi.string().required().custom(objectId),
    }),
};

export default { complete };