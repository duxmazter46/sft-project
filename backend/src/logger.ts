import winston from 'winston';
import { gray } from 'colorette'; // For coloring the logs

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set the logging level to info
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      // Set a max length for the main line (80 characters, including timestamp and level)
      const maxLineLength = 80;
      let formattedMessage = message;

      // Apply word wrap if the message is too long
      if (message.length > maxLineLength) {
        formattedMessage = message.replace(
          new RegExp(`(.{1,${maxLineLength}})(\\s|$)`, 'g'),
          (line: string) => `${line.trim()}\n${' '.repeat(53)}` // 53 spaces for indentation after timestamp and level
        ).trim();
      }

      return `${gray(timestamp)} [${level.toUpperCase()}]: ${formattedMessage}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'app.log' }) // Log to a file
  ]
});

export default logger;
