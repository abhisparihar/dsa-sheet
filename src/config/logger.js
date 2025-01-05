import winston from 'winston';
import config from './config.js';
import { existsSync, mkdirSync } from 'fs';
import { resolve as resolvePath, dirname } from 'path';

import { fileURLToPath } from 'url';

import Logger from 'smart-logs';
import 'winston-daily-rotate-file';

const smartLogger = new Logger();

//set log directory default will be logs
smartLogger.setLogDir('logs');

//set log file size, default will unlimited
smartLogger.setSize('5m');

//set log formate type
smartLogger.setFormateType('tab');

// Get the current module's file URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

if (!existsSync(resolvePath(__dirname, '../../logs'))) {
  mkdirSync(resolvePath(__dirname, '../../logs'), { recursive: true });
}

smartLogger.setLogDir(resolvePath(__dirname, '../../logs'));

const createLog = (name = '') => {
  return smartLogger.getLogger(name);
};

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export { logger, createLog };
