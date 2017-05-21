'use strict';

const MovieDB = require('moviedb')(process.env.MOVIE_DB_KEY);

module.exports = {

  getInitialMovies(event, context, callback){
    let response;

    MovieDB.discoverMovie({
      sort_by: 'vote_count.dsc',
      'vote_count.gte': 750,
      page: getRandomInt(1, 50),
    }, (err, res) => {
      if (err) {
        callback(err, err);
        return console.error(err);
      }

      const output = res.results.splice(0, 8);

      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(output),
      };

      callback(null, response);
    });
  },
  getMovie(event, context, callback) {
    let response;

    MovieDB.discoverMovie({
      sort_by: 'original_title.asc',
      'vote_count.gte': 750,
      page: getRandomInt(1, 50),
    }, (err, res) => {
      if (err) {
        callback(err, err);
        return console.error(err);
      }

      const num = res.results.length;

      const output = res.results[getRandomInt(0, num)];

      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(output),
      };

      callback(null, response);
    });
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
