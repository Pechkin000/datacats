'use strict';

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (typeof process.loadEnvFile === 'function' && fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const { createApp } = require('./src/app');

// Passenger (cPanel Node.js App) injects the port or socket through listen().
createApp().listen(process.env.PORT || 3001);
