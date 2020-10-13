import express from 'express';
import accountsRounter from './routers/grades.js';
import winston from 'winston';

import { promises as fs } from 'fs';

const { combine, printf, label, timestamp } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-api.log' }),
  ],
  format: combine(label({ label: 'grades-api' }), timestamp(), myFormat),
});

const app = express();
app.use(express.json());
app.use('/grades', accountsRounter);

app.listen(3000, async () => {
  try {
    const file = await fs.readFile('gradesTest.json');
    logger.info('API Started');
  } catch (err) {
    logger.error(err);
  }
});
