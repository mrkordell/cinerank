'use strict';

const MovieDB = require('moviedb')(process.env.MOVIE_DB_KEY);

module.exports.getMovie = (event, context, callback) => {
  let response;

  MovieDB.discoverMovie({
    sort_by: 'original_title.asc',
    'vote_count.gte': getRandomInt(250, 1000),
  }, (err, res) => {
    if (err) {
      callback(err, err);
      return console.error(err);
    }

    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify(res),
    };

    callback(null, response);
  });

};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
