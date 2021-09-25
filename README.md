# Where to Eat
The smart app for helping friends decide where to eat

[**wheretoeat.debkbanerji.com**](https://wheretoeat.debkbanerji.com)

<sub>Note: loading can be slow if the server isn't warmed up, but waiting a short time and refreshing the page usually resolves the issue</dub>


## Deployment instructions

In order to deploy the app, you will need a Yelp api key, obtainable by registering an application on the Yelp api console.

Set either the `YELP_API_KEY` environment variable equal to your api key, or store it in `credentials/yelp-api-key.txt`

The app can then be run by running `npm install` followed by `npm start` from the application's root directory. Many production environments will do this for you.
