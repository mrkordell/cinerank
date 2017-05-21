/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* eslint no-new: "off" */

import Vue from 'vue';
import axios from 'axios';

new Vue({
  el: '#app',
  data: {
    movies: [],
    winners: [],
    m: [
      { poster_path: '/static/images/ring.gif' },
      { poster_path: '/static/images/ring.gif' },
    ],
    path: 'http://image.tmdb.org/t/p/w600',
    prod_api: 'https://api.cinebound.com/rank/api',
    dev_api: 'http://localhost:3000/api',
  },
  mounted() {
    this.getMovies();
  },

  methods: {
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
      this.winners.push(this.m[key]);

      // this.winners.push(this.m.filter(movie => movie.id === event.data.id));

      this.newMovies();
    },

    haventSeen(id) {
      const movie = this.m[id];
      this.m.filter(mov => mov.id !== movie.id);
    },

    getMovies() {
      const that = this;
      axios.get(`${this.dev_api}/movies`).then((response) => {
        that.movies = response.data;
        that.newMovies();
      });
    },

    getMovie() {
      const that = this;
      axios.get(`${this.dev_api}/movie`).then((response) => {
        that.movies.push(response.data);
      });
    },

    cleanMovies() {
      this.movies = this.movies.filter(n => n !== null);
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
