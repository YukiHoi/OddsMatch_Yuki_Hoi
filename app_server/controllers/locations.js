const request = require('request');
const apiOptions = { 
server : 'http://localhost:3000' 
}; 
if (process.env.NODE_ENV === 'production') { 
apiOptions.server = ' your render server address'; 
}

/* GET 'home' page */
const _renderHomepage = (req, res, responseBody) => {
  const race = responseBody && responseBody.length ? responseBody[0] : null;
  const user = req.session.user || null;
  
  res.render('index', {
    title: 'Race Details',
    pageHeader: {
      title: race ? race.course : 'Races',
      time: race ? race.raceTime : '',
      distance: race ? race.distance : '',
      type: race ? race.type : '',
    },
    sidebar: race ? (race.description || `Today at ${race.course}: Race card and prices.`) : 'No Races Available',
    locations: responseBody,
    user: user  // Pass user info to the template
  });
};
const homelist = function(req, res){
  const path = '/api/races';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
  };
  request(
    requestOptions, (err, response, body) => {
      let data = [];
      if (response && response.statusCode === 200) {
        data = body;
      }
      _renderHomepage(req, res, data);
    }
  );
};

// Export controller methods
module.exports = {
  homelist,
};
