#!/usr/bin/env node

// Imports
const moment = require("moment-timezone");

// Collect arguments passed
const [,, ...args] = process.argv

let got_lat = false;
let got_long = false;

let lat = 0;
let long = 0;

let day = 1;

let echo_json = false;

let timezone = moment.tz.guess();

// Parse args
for(let i = 0; i < args.length; i++) {
    switch(args[i]) {
        case '-h':
            console.log(
                `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
                -h            Show this help message and exit.
                -n, -s        Latitude: N positive; S negative.
                -e, -w        Longitude: E positive; W negative.
                -z            Time zone: uses tz.guess() from moment-timezone by default.
                -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
                -j            Echo pretty JSON from open-meteo API and exit.`
            );
            return 0;
        case '-n':
        case '-s':
            got_lat = true;
            lat = parseInt(args[i+1]);
            if(args[i] == '-s') lat = -lat;
            i++;
            break;
        case '-e':
        case '-w':
            got_long = true;
            long = parseInt(args[i+1]);
            if(args[i] == '-w') long = -long;
            i++;
            break;
        case '-z':
            timezone = args[i+1];
            i++;
            break;
        case '-d':
            day = parseInt(args[i+1]);
            i++;
            break;
        case '-j':
            echo_json = true;
            break;
        default:
            console.error(`Invalid option: ${args[i]}`);
            return 1;
    }
}

console.log(lat, long, timezone, day);