import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { createLog } from '../config/logger.js';
import { createMultipleTopics, listTopic, topicAdds } from '../services/topic.service.js';
import ApiError from '../utils/ApiError.js';

// Create a logger instance for the auth controller
const logger = createLog('auth_controller');

/**
 * Controller to fetch the list of topics.
 * Fetches all topics from the database and sends the response.
 *
 * @async
 * @function topiclist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const topiclist = catchAsync(async (req, res) => {
    // Fetch topics from the service
    const list = await listTopic();

    // Log the fetched topics
    logger.info(`Fetched topics: ${JSON.stringify(list)}`);

    // Send response
    res.status(httpStatus.OK).send({
        type: 'success',
        data: list,
        message: 'Fetched list of topics successfully.',
    });
});

/**
 * Controller to add a new topic.
 * Extracts the topic details from the request body, 
 * adds the topic to the database, and sends the response.
 *
 * @async
 * @function addTopic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const addTopic = catchAsync(async (req, res) => {
    const { title, level, subtopics } = req.body;

    // Construct the topic object
    const topicData = {
        title,
        level,
        subtopics,
    };

    // Log the topic details to be added
    logger.info(`Adding topic: ${JSON.stringify(topicData)}`);

    // Add the topic using the service
    const addedTopic = await topicAdds(topicData);

    // Send response
    res.status(httpStatus.OK).send({
        type: 'success',
        data: addedTopic,
        message: 'Topic added successfully.',
    });
});

const addMultipleTopics = catchAsync(async (req, res) => {
    const topics = req.body; // Array of topics passed in the request body

    // Get all existing topics from the database
    const existingTopics = await listTopic();

    // Check for duplicate titles
    const duplicateTitles = topics.filter(topic =>
        existingTopics.some(existingTopic => existingTopic.title === topic.title)
    );

    if (duplicateTitles.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate title(s) found', {
            duplicateTitles: duplicateTitles.map(topic => topic.title),
        });
    }

    // Assuming a function to create multiple topics
    const createdTopics = await createMultipleTopics(topics);

    // Log the successful creation of topics
    logger.info(`Multiple topics created successfully: ${JSON.stringify(createdTopics)}`);

    res.status(httpStatus.CREATED).send({
        type: 'success',
        data: createdTopics,
        message: 'Multiple topics added successfully',
    });
});

// Exporting the controller methods
export default {
    topiclist,
    addTopic,
    addMultipleTopics
};
