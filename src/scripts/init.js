import mongoose from "mongoose";
import config from '../config/config.js';

import { createLog } from '../config/logger.js';

const logger = createLog('init_script');

/**
 * Initial script to insert default data
 */
(async () => {
    try {
        const adminClient = new mongoose.mongo.MongoClient(config.mongoose.rootURL);
        await adminClient.connect();

        logger.info('Database connected.');

        const dbURL = `mongodb://${config.mongoose.username}:${config.mongoose.password}@${config.mongoose.host}:${config.mongoose.port}/${config.mongoose.database}`;

        const userClient = new mongoose.mongo.MongoClient(dbURL);

        try {
            await userClient.connect();
            logger.info('Dsa Sheet - Database connected.');
        } catch (error) {
            const db = adminClient.db(config.mongoose.database);
            await db.command({
                createUser: config.mongoose.username,
                pwd: config.mongoose.password,
                roles: [
                    { role: 'dbAdmin', db: config.mongoose.database },
                    { role: 'readWrite', db: config.mongoose.database },
                ],
            });

            logger.info('Dsa Sheet - Database Admin created');
            await mongoose.connect(dbURL);
            logger.info('Default user created.');
        }
        setTimeout(() => {
            // to ensure logger is finished logging before we exit the process
            process.exit(0);
        }, 1000);
    } catch (error) {
        logger.error('Error while executing init script', error);
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
})();