import Topic from '../models/token.model.js';

export const listTopic = async () => {
    return await Topic.find();
};
