import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { createLog } from '../config/logger.js';
import { updateUser, userDetails } from '../services/user.service.js';
import { listTopic } from '../services/topic.service.js';
import ApiError from '../utils/ApiError.js';

// Create a logger instance for the auth controller
const logger = createLog('auth_controller');

/**
 * Controller for marking a subtopic as completed.
 * Adds the given subtopic ID to the user's completedTopics array.
 *
 * @async
 * @function complete
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const complete = catchAsync(async (req, res) => {
    const { _id } = req.user; // User ID from authenticated user
    const { subtopicId } = req.body; // Subtopic ID to mark as completed

    // Log the completed subtopic details
    logger.info(`Completed subtopic details for: ${subtopicId}`);

    // Update the user's completedTopics with the new subtopic ID
    await updateUser({ _id }, { $addToSet: { completedTopics: subtopicId } });

    // Send success response
    res.status(httpStatus.OK).send({
        type: 'success',
        data: {},
        message: 'This topic completed successfully.',
    });
});

/**
 * Controller for fetching the user's progress.
 * Fetches the list of completed topics for the authenticated user.
 *
 * @async
 * @function progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const progress = catchAsync(async (req, res) => {
    const { completedTopics } = req.user; // Get the completed topics for the user

    // If no completed topics are found, throw an error
    if (!completedTopics) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to fetch progress');
    }

    // Send the list of completed topics as the response
    res.status(httpStatus.OK).send({
        type: 'success',
        data: completedTopics,
        message: 'Fetched completed topics successfully.',
    });
});


/**
 * Fetch completed subtopics based on completed subtopic IDs in the user's data.
 * 
 * @async
 * @function getCompletedSubtopics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const getCompletedSubtopics = catchAsync(async (req, res) => {
    console.log("🚀 ~ getCompletedSubtopics ~ req.user:", req.user)
    const { completedTopics } = req.user; // Completed subtopics IDs from the user
    const topics = await listTopic(); // Assuming this fetches all topics with subtopics
    console.log("🚀 ~ getCompletedSubtopics ~ topics:", topics)

    if (!topics) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Topics not found');
    }

    // Create a new array to store the completed subtopics
    const completedSubtopics = topics.flatMap(topic =>
        topic.subtopics.filter(subtopic =>
            completedTopics.includes(subtopic._id.toString()) // Match the subtopic ID
        )
    );

    console.log("🚀 ~ getCompletedSubtopics ~ completedSubtopics:", JSON.stringify(completedSubtopics))
    // Return the filtered topics with only completed subtopics
    res.status(httpStatus.OK).send({
        type: 'success',
        data: completedSubtopics,
        message: 'Fetched completed subtopics for all topics',
    });
});

// Exporting the controller methods
export default {
    complete,
    progress,
    getCompletedSubtopics,
};