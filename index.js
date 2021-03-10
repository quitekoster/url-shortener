/*
 * URL Shortener Service focusing on user privacy and security.
 * Copyright (C) 2021 Christopher Koster <christopher@kostertech.io>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Helmet introduces some security changes for Express
app.use(helmet());

// Get the log file path from the environment or specify a default path in the logs folder
const LOG = process.env.LOG ?? path.join(__dirname, 'morgan.log');

// Doing everthing synchronously, as the server will rely on this file to exist before it can start (without crashing at least)
// Test to see if the LOG files exists, and if it doesn't, create it by writing a null char to the path.
if (!fs.existsSync(LOG)){
    // Create the file with the null char
    fs.writeFileSync(LOG, '\0', { flag: 'w'});
}

// Use morgan to log out to a file
app.use(morgan('common', { stream: fs.createWriteStream(LOG, { flags: 'a' }) }));

// User morgan to log to the console
app.use(morgan('dev'));

// Get the listening port from the environmental or specify 3000 as default
const PORT = process.env.PORT ?? 3000;

// Listen and log to console when it starts accepting connections
app.listen(PORT, () => console.log(`[express] - listening on *:${PORT}`));