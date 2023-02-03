#!/usr/bin/env node

// Imports
import moment from "moment-timezone";
// Collect arguments passed
const [,, ...args] = process.argv

let lat = NaN;
let long = NaN;

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
            process.exit(0);
        case '-n':
        case '-s':
            lat = parseInt(args[i+1]);
            if(args[i] == '-s') lat = -lat;
            i++;
            break;
        case '-e':
        case '-w':
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
            process.exit(1);
    }
}

const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=precipitation_sum&timezone=${timezone}`

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        if(echo_json) {
            console.log(data);
        } else {
            let precip = data.daily.precipitation_sum;
            console.log(`You ${precip[day] > 0 ? "might" : "will not"} need your galoshes ${day == 0 ? "today" : (day == 1 ? "tomorrow" : `in ${day} days`)}.`)
        }
    });
