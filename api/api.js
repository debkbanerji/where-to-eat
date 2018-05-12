const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');

console.log('Running api.js');

const router = express.Router();

const BUSINESS_SEARCH_URL = 'https://api.yelp.com/v3/businesses/search';

let fileAPIKey;
const keyFilePath = path.join('credentials', 'yelp-api-key.txt');
if (fs.existsSync(keyFilePath)) {
    fileAPIKey = fs.readFileSync(keyFilePath, 'utf8');
}

const YELP_API_KEY = process.env.YELP_API_KEY || fileAPIKey;
if (!YELP_API_KEY) {
    const errorMessage = 'Could not find ' + keyFilePath + ' or YELP_API_KEY environment variable';
    console.log(errorMessage);
    throw new Error(errorMessage);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

router.get('/nearby-places', function (req, res) {
    const params = req.query;

    if ((!params.location) && (!params.latitude || !params.longitude)) {
        const errorMessage = 'You must specify either a location or a latitude and longitude to search.';
        res.status(500).send(errorMessage);
        // } else if (params.location && params.latitude && params.longitude) {
        //     const errorMessage = 'You must cannot specify both a location and coordinates to search.';
        //     res.status(500).send(errorMessage);
    } else {
        const requestOptions = {};
        if (params.latitude && params.longitude) {
            requestOptions.latitude = params.latitude;
            requestOptions.longitude = params.longitude;
        }
        if (params.location) {
            requestOptions.location = params.location;
        }
        requestOptions.radius = params.radius || 3000;
        requestOptions.limit = params.limit || 25;
        // Sort by best_match, rating, review_count or distance
        requestOptions.sort_by = params.sort_by || 'distance';
        requestOptions.open_now = params.open_now || true;
        requestOptions.price = params.price || '1,2,3,4';
        requestOptions.categories = params.categories || 'restaurants,food';

        if (params.term) {
            requestOptions.term = params.term;
            // requestOptions.sort_by = params.sort_by || 'best_match';
        }

        const requestOptionsKeys = Object.keys(requestOptions);
        const requestOptionsList = [];
        for (let i = 0; i < requestOptionsKeys.length; i++) {
            const key = requestOptionsKeys[i];
            requestOptionsList.push(key + '=' + requestOptions[key]);
        }
        const targetURL = BUSINESS_SEARCH_URL + '?' + requestOptionsList.join('&');

        if (process.env.USE_DEBUG_LOG) {
            console.log(targetURL);
        }

        request.get({
            url: targetURL,
            headers: {'Authorization': 'Bearer ' + YELP_API_KEY},
        }, function (error, yelpResponse, body) {
            if (error) {
                res.status(500).send(error.toString());
            } else {
                body = JSON.parse(body);

                // if (process.env.USE_DEBUG_LOG) {
                //     console.log(body);
                // }

                const allPlaces = body['businesses'];

                //Remove duplicates
                const placeNames = [];
                const places = [];

                const minRating = params.min_rating || 1;

                if (allPlaces) {
                    for (let i = 0; i < allPlaces.length; i++) {
                        const placeName = allPlaces[i].name;
                        if (placeNames.indexOf(placeName) < 0 && allPlaces[i].rating >= minRating) {
                            placeNames.push(placeName);
                            places.push(allPlaces[i]);
                        }
                    }
                }

                shuffleArray(places);

                let searchCenter;
                if (body['region']) {
                    searchCenter = body['region']['center'];
                } else {
                    searchCenter = {
                        latitude: null,
                        longitude: null
                    }
                }
                res.send({
                    places: places,
                    search_center: searchCenter
                })
            }
        })
    }
});

console.log('Exporting router');
module.exports = router;