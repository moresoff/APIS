//codigo celina vidal
class MovieDetails {
  constructor(container, title, description, rating, duration) {
    this.container = container;
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.duration = duration;
    this.render();
  }


  render() {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details-container');


    const details = `
      <h3>${this.title}</h3>
      <p>${this.description}</p>
      <p>Rating: ${this.rating}</p>
      <p>Duración: ${this.duration}</p>
    `;
    detailsContainer.innerHTML = details;


    this.container.appendChild(detailsContainer);
  }
}


export default MovieDetails;
