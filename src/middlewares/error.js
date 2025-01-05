/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../config/config.js';
import ApiError from '../utils/ApiError.js';
import { createLog } from '../config/logger.js';

const logger = createLog('error.js');

const errorConverter = async (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;
  const response = {
    code: statusCode,
    message,
    type: 'error',
    ...(config.env === 'development' && { stack: err.stack }),
  };

  logger.error(`errorHandler => ${err}`);
  logger.error(`errorHandler => ${err.stack}`);
  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
