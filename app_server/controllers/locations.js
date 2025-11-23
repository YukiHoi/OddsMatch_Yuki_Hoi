const request = require('request');

// Work both locally and on Render
// On Render, process.env.PORT is set by the platform 
const port = process.env.PORT || 3000;

const apiOptions = {
  // If API_SERVER is set, use it; otherwise talk to our own Express app
  server: process.env.API_SERVER || `http://localhost:${port}`
};

/* Render home page */
const _renderHomepage = (req, res, responseBody) => {
  const race = responseBody && responseBody.length ? responseBody[0] : null;
  const user = req.user || null;

  res.render('index', {
    title: 'Race Details',
    pageHeader: {
      title: race ? race.course : 'Races',
      time: race ? race.raceTime : '',
      distance: race ? race.distance : '',
      type: race ? race.type : ''
    },
    sidebar: race
      ? (race.description || `Today at ${race.course}: sample card and prices.`)
      : 'No Races Available',
    locations: responseBody || [],
    user: user
  });
};

const homelist = (req, res) => {
  const path = '/api/races';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };

  request(requestOptions, (err, response, body) => {
    let data = [];

    if (!err && response && response.statusCode === 200 && Array.isArray(body)) {
      data = body;
    } else {
      console.error('Error calling /api/races from locations.js', {
        error: err && err.message,
        status: response && response.statusCode
      });
    }

    _renderHomepage(req, res, data);
  });
};

// Export controller methods
module.exports = {
  homelist
};
