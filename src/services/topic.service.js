import Topic from '../models/topic.model.js';

export const listTopic = async () => {
    return await Topic.find();
};

export const topicAdds = async (body) => {
    return await Topic.create(body)
}

export const createMultipleTopics = async (topics) => {
    return await Topic.insertMany(topics);
}