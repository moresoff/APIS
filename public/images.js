// codigo celina vidal
class Images {
  constructor(container, imageUrl) {
    this.container = container;
    this.imageUrl = imageUrl;
    this.render();
  }

  render() {
    const image = new Image();
    image.src = this.imageUrl;
    image.alt = 'Movie Poster';
    image.classList.add('movie-poster');
    this.container.appendChild(image);
  }
}

export default Images;

