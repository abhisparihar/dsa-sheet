import User from '../models/user.model.js';

/**
 * Login user by email
 * @param {string} email
 * @return {Promise<User>}
 */
export const loginUserByEMail = async ({ email }) => {
    return await User.findOne({ email });
};

/**
 * Create a user
 * @param {Object} userBody
 * @return {Promise<User>}
 */
export const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        logger.error(`createUser => Email already taken`);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return await User.create(userBody);
};

export const updateUser = async (query, body) => {
    return await User.updateOne(query, body);
}

export const userDetails = async (query, select = {}) => {
    return await User.findOne(query, select);
}