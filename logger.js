const { createLogger, format, transports } = require('winston');
const { timestamp, combine, printf } = format;
const path = require('path');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: path.join(__dirname, 'all.log') }),
  ],
});

module.exports = logger
