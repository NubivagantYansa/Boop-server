require("dotenv").config();
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  //fetch: customFetchImplementation,
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
