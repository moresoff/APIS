// codigo celina vidal
class CineDetails {
    constructor(container, Nombre, Dirección, Pelicula1, Pelicula2, Pelicula3, Pelicula4, Pelicula5) {
      this.container = container;
      this.Nombre = Nombre;
      this.Dirección = Dirección;
      this.Pelicula1 = Pelicula1;
      this.Pelicula2 = Pelicula2;
      this.Pelicula3 = Pelicula3;
      this.Pelicula4 = Pelicula4;
      this.Pelicula5 = Pelicula5;
      this.render();
      
    }
  
    render() {
      const descriptionContainer = document.createElement('div');
      descriptionContainer.classList.add('description-container');
  
      const description = `
        <h3>${this.Nombre}</h3>
        <p>${this.Dirección}</p>
        <p>Películas en cartelera: ${this.Pelicula1}, ${this.Pelicula2}, ${this.Pelicula3}, ${this.Pelicula4}, ${this.Pelicula5}</p>
      `;
      descriptionContainer.innerHTML = description;
  
      this.container.appendChild(descriptionContainer);
    }
    
  }
  
  class App {
    loadCineDetails() {
        fetch('/loadCines')
        .then(this._onResponse)
        .then(this._onJsonReady.bind(this))
        .catch(error => console.error('Error fetching data:', error));
    }
  
    _onResponse(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  
    _onJsonReady(json) {
      console.log('Fetched JSON:', json);
      const cinesList = json.cines;
      const detailsContainer = document.querySelector('#cine-container');
  
      if (!detailsContainer) {
        console.error('Cine container not found in the DOM.');
        return;
      }
  
      for (const cine of cinesList) {
        const cineElement = document.createElement('div');
        cineElement.classList.add('cine-container');
  
        new CineDetails(cineElement, cine.Nombre, cine.Dirección, cine.Pelicula1, cine.Pelicula2, cine.Pelicula3, cine.Pelicula4, cine.Pelicula5);
  
        detailsContainer.appendChild(cineElement);
      }
    }
  }
  
  class Comentarios {
    constructor() {
      const comentarioForm = document.querySelector('#comentario-form');
      comentarioForm.addEventListener('submit', this.saveComment.bind(this));
      this.loadComments(); // Cargar comentarios al inicializar la clase
    }
  
    saveComment(event) {
      event.preventDefault(); // Evita que el formulario se envíe automáticamente
    
      const cine = event.target.elements.cine.value;
      const comentario = event.target.elements.comentario.value;
    
      const comment = { cine, comentario };
    
      fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Comentario enviado');
          window.location.reload();
        } else {
          throw new Error('Error al guardar comentario');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    loadComments() {
      fetch('/comments') // Endpoint para obtener todos los comentarios
        .then(response => response.json())
        .then(comments => {
          this.showComments(comments); // Mostrar comentarios en la interfaz
        })
        .catch(error => console.error('Error fetching comments:', error));
    }
  
    showComments(comments) {
      const commentsContainer = document.querySelector('#comments-container');
      commentsContainer.innerHTML = ''; // Limpia el contenedor
  
      comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
          <h4>${comment.username}</h4>
          <h5>${comment.cine}</h5>
          <p>Comentario: ${comment.comentario}</p>
        `;
        commentsContainer.appendChild(commentElement);
      });
  
      commentsContainer.classList.remove('hidden');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new App().loadCineDetails();
    new Comentarios();
  });