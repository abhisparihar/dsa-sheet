import dotenv from 'dotenv';
import { join, dirname } from 'path'
import Joi from 'joi';

import { fileURLToPath } from 'url'

// Get the current module's file URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'uat', 'development').required(),
        PORT: Joi.number().default(3000),
        MONGODB_ROOT_URL: Joi.string().required().description('Mongo DB url'),
        MONGODB_HOST: Joi.string().required().description('Mongo DB host'),
        MONGODB_USER: Joi.string().required().description('Mongo DB username'),
        MONGODB_PWD: Joi.string().required().description('Mongo DB password'),
        MONGODB_DB: Joi.string().required().description('Mongo DB database'),
        MONGODB_PORT: Joi.string().required().description('Mongo DB port'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        rootURL: envVars.MONGODB_ROOT_URL,
        url: `mongodb://${envVars.MONGODB_USER}:${envVars.MONGODB_PWD}@${envVars.MONGODB_HOST}:${envVars.MONGODB_PORT}/${envVars.MONGODB_DB}`,
        host: envVars.MONGODB_HOST,
        username: envVars.MONGODB_USER,
        password: envVars.MONGODB_PWD,
        database: envVars.MONGODB_DB,
        port: envVars.MONGODB_PORT,
        options: {},
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
};

export default config;