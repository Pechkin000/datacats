'use strict';

const { createApp } = require('./src/app');

// Passenger (cPanel Node.js App) injects the port or socket through listen().
createApp().listen(process.env.PORT || 3001);
