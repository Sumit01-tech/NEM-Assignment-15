const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const logFilePath = path.join(__dirname, 'timestamp.log');

cron.schedule('* * * * *', () => {
    const timestamp = new Date().toISOString();
    const logEntry = `Timestamp: ${timestamp}\n`;

    console.log(logEntry.trim());

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
});

console.log('Cron job scheduled to log timestamp every minute.');
