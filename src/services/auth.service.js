import httpStatus from 'http-status';
import Token from '../models/token.model.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import * as userService from './user.service.js';
import { tokenTypes } from '../config/tokens.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @return {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password,) => {
    const user = await userService.loginUserByEMail({ email, });
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @return {Promise}
 */
export const logout = async (refreshToken,) => {
    const refreshTokenDoc = await Token.findOne(
        { token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false },
        { _id: 1 },
    ).lean();
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found.');
    }
    await Token.deleteOne({ _id: refreshTokenDoc._id });
};