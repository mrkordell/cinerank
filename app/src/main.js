/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* eslint no-new: "off" */

import Vue from 'vue';
import axios from 'axios';
import Elo from 'elo-js';

new Vue({
  el: '#app',
  data: {
    movies: [],
    shame: [],
    winners: [],
    elo: [],
    m: [
      { poster_path: '/static/images/ring.gif' },
      { poster_path: '/static/images/ring.gif' },
    ],
    path: 'http://image.tmdb.org/t/p/w500',
    api_url: process.env.API_HOST,
  },
  mounted() {
    this.getMovies();
  },

  computed: {
    topTen() {
      return this.elo.slice(0, 9);
    },
  },

  methods: {
    checkElo() {
      this.movies.forEach((movie) => {
        const mov = movie;
        const elo = this.elo.filter(m => m.id === movie.id);
        if (elo.length === 0) {
          mov.elo = 1000;
          this.elo.push(mov);
        }
      });

      this.elo.sort((a, b) => {
        if (a.elo > b.elo) {
          return -1;
        }
        if (a.elo < b.elo) {
          return 1;
        }
        return 0;
      });
    },

    image(key) {
      if (this.m[key].poster_path.includes('/static/')) {
        return this.m[key];
      }
      return this.path + this.m[key].poster_path;
    },

    getRandomInt(min, max) {
      const minimum = Math.ceil(min);
      const maximum = Math.floor(max);
      return Math.floor(Math.random() * (maximum - minimum)) + minimum;
    },

    pick(key) {
      const elo = new Elo();
      const winner = this.elo.filter(m => m.id === this.m[key].id)[0];
      let loser;
      if (key) {
        loser = 0;
      } else {
        loser = 1;
      }
      loser = this.elo.filter(m => m.id === this.m[loser].id)[0];

      this.elo.map((e) => {
        if (e.id === winner.id) {
          e.elo = elo.ifWins(winner.elo, loser.elo);
        }
        if (e.id === loser.id) {
          e.elo = elo.ifLoses(loser.elo, winner.elo);
        }
        return e;
      });

      this.winners.push(this.m[key]);

      this.newMovies();
    },

    haventSeen(id) {
      const movie = this.m[id];
      this.shame.push(movie);

      this.elo.filter(e => e.id !== movie.id);

      this.newMovie(id);
    },

    haventSeenEither() {
      this.shame.push(this.m[0]);
      this.shame.push(this.m[1]);
      this.newMovies();
    },

    getMovies() {
      const that = this;
      axios.get(`${this.api_url}/movies`).then((response) => {
        that.movies = response.data;
        that.checkElo();
        that.newMovies();
      });
    },

    getMovie() {
      const elo = this.elo.length;
      if (this.elo > 20 && this.getRandomInt(0, 1)) {
        this.movies.push(this.elo[this.getRandomInt(0, elo)]);
      } else {
        const that = this;
        axios.get(`${this.api_url}/movie`).then((response) => {
          if (this.shame.filter(m => m.id === response.data.id).length === 0) {
            that.movies.push(response.data);
            that.checkElo();
          } else {
            this.getMovie();
          }
        });
      }
    },

    cleanMovies() {
      this.movies = this.movies.filter(n => n !== null);
    },

    cleanElo() {
      this.elo = this.elo.filter(n => n !== null);
    },

    newMovie(id) {
      if (id) {
        this.m.pop();
      } else {
        this.m.shift();
      }
      this.m.push(this.movies.shift());
      if (!id) {
        this.m.reverse();
      }
      this.getMovie();
      this.preloadPosters();
    },

    newMovies() {
      this.newMovie(0);
      this.newMovie(1);
      this.preloadPosters();
    },

    preloadPosters() {
      this.preloadPoster(0);
      this.preloadPoster(1);
    },

    preloadPoster(key) {
      const img = new Image();
      img.src = this.path + this.movies[key].poster_path;
    },
  },
});
