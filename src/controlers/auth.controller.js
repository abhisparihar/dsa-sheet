import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcrypt';
import { loginUserWithEmailAndPassword, logout as logoutUser } from '../services/auth.service.js';
import { generateAuthTokens } from '../services/token.service.js';
import { createLog } from '../config/logger.js';
import { createUser } from '../services/user.service.js';

// Logger instance for auth controller
const logger = createLog('auth_controller');

/**
 * Controller to handle user login.
 * Authenticates the user with their email and password and generates auth tokens.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body; // Get user credentials from request

    // Attempt to login the user with the provided email and password
    const user = await loginUserWithEmailAndPassword(email, password);

    // Log user details (sensitive info should be avoided in real apps)
    logger.info(`Login attempt by user: ${JSON.stringify(user)}`);

    // Generate authentication tokens (access and refresh)
    const tokens = await generateAuthTokens(user);

    // Send successful login response with user and tokens
    res.status(httpStatus.OK).send({
        type: 'success',
        data: { user, tokens },
        message: 'Login successful',
    });
});

/**
 * Controller to handle user logout.
 * Invalidates the user's refresh token to log them out.
 *
 * @async
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.body; // Get refresh token from request body

    // Logout the user by invalidating the provided refresh token
    await logoutUser(refreshToken);

    // Log logout action with refresh token details (for traceability)
    logger.info(`Logout request with refresh token: ${JSON.stringify(refreshToken)}`);

    // Send successful logout response
    res.status(httpStatus.OK).send({
        type: 'success',
        message: 'Logout successful',
    });
});

/**
 * Controller to handle user registration.
 * Registers a new user by hashing their password and saving their data.
 *
 * @async
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const register = catchAsync(async (req, res) => {
    const { firstName, lastName, email, password } = req.body; // Get user details from request

    // Generate a salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Prepare user object with hashed password
    const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
    };

    // Create new user in the database
    const user = await createUser(userData);

    // Log user creation details (avoid logging sensitive information like password)
    logger.info(`User Created Successfully => ${JSON.stringify(user)}`);

    // Send successful registration response
    res.status(httpStatus.CREATED).send({
        type: 'success',
        data: user,
        message: 'User registered successfully',
    });
});

// Export controller methods for use in routes
export default {
    login,
    logout,
    register,
};