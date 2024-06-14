import Images from './images.js';
import MovieDetails from './moviedetails.js';


class App {
  constructor() {
    this._onJsonReady = this._onJsonReady.bind(this);
    this._onAscClick = this._onAscClick.bind(this);
    this._onDescClick = this._onDescClick.bind(this);
    this._onAlphaClick = this._onAlphaClick.bind(this);

    document.addEventListener('DOMContentLoaded', () => {
      const ascButton = document.querySelector("#asc");
      ascButton.addEventListener("click", this._onAscClick);
      const descButton = document.querySelector("#desc");
      descButton.addEventListener("click", this._onDescClick);
      const alphaButton = document.querySelector("#alpha");
      alphaButton.addEventListener("click", this._onAlphaClick);
      this.loadMovies();
    });
  }

  _onAscClick() {
    this.moviesList.forEach(pelicula => {
      pelicula.duracionNumero = parseInt(pelicula.duration.replace(' min', '')); 
  });
  this.moviesList.sort((a, b) => b.duracionNumero - a.duracionNumero);
  this.moviesList.forEach(pelicula => {
      delete pelicula.duracionNumero;
  });
    this._renderMovies(); 
  }

  _onDescClick() {
    this.moviesList.forEach(pelicula => {
      pelicula.duracionNumero = parseInt(pelicula.duration.replace(' min', '')); 
  });
  this.moviesList.sort((a, b) => a.duracionNumero - b.duracionNumero);
  this.moviesList.forEach(pelicula => {
      delete pelicula.duracionNumero;
  });
  this._renderMovies();
  }

  _onAlphaClick() {
    this.moviesList.sort((a, b) => a.title.localeCompare(b.title));
  this.moviesList.forEach(pelicula => {
      delete pelicula.duracionNumero;
  });
  this._renderMovies();
    }

  //CLICKS

  _renderMovies(sortFn) {
    const imageContainer = document.querySelector('#image-container');
    imageContainer.innerHTML = "";  // Clear the container first
    for (const movie of this.moviesList) {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-container');
      new Images(movieElement, movie.image);
      new MovieDetails(movieElement, movie.title, movie.description, movie.rating, movie.duration);
      imageContainer.appendChild(movieElement);  // Añadir al contenedor de imágenes
    }
  }

  loadMovies() {
    fetch('/loadMovies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Datos');
        }
        return response.json();
      })
      .then(this._onJsonReady)
      .catch(err => console.error('Error loading movies:', err));
  }

  _onJsonReady(json) {
    this.moviesList = json.movies;
    this._renderMovies((a, b) => a.title.localeCompare(b.title));  // Orden inicial alfabético
    this.loadImages(json.movies);  // Cargar imágenes después de obtener las películas
  }

  loadImages(moviesList) {
    const imageContainer = document.querySelector('#image-container');
    imageContainer.innerHTML = "";  // Clear the container first
    for (const movie of moviesList) {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie-container');
      new Images(movieElement, movie.image);
      new MovieDetails(movieElement, movie.title, movie.description, movie.rating, movie.duration);
      imageContainer.appendChild(movieElement);  // Añadir al contenedor de imágenes
    }
  }
}




const app = new App();
