// codigo celina vidal 
class Comments {
    constructor() {
        const commentForm = document.querySelector('#comment-form');
        commentForm.addEventListener('submit', this.saveComentario.bind(this));
        this.loadComentario(); // Cargar comentarios al inicializar la clase
    }
  
    saveComentario(event) {
        event.preventDefault();
    
        const pelicula = event.target.elements.pelicula.value;
        const comment = event.target.elements.comment.value;
    
        const Comments = { pelicula, comment };
    
        fetch('/comentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Comments)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Comentario enviado y guardado');
                this.loadComentario();
                window.location.reload();
            } else {
                throw new Error('Error al guardar comentario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
  
    loadComentario() {
        fetch('/comentario') // Actualiza la ruta a /comentario
            .then(response => response.json())
            .then(comentario => {
                this.showComentario(comentario);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }
  
    showComentario(comentario) {
        const comentarioPeliContainer = document.querySelector('#comentarioPeli-container');
        if (!comentarioPeliContainer) {
            console.error('Elemento comentarioPeli-container no encontrado');
            return;
        }
        comentarioPeliContainer.innerHTML = ''; // Limpia el contenedor
  
        comentario.forEach(comentario => {
            const comentarioElement = document.createElement('div');
            comentarioElement.classList.add('comentario');
            comentarioElement.innerHTML = `
                <h4>${comentario.username}</h4>
                <h5>${comentario.pelicula}</h5>
                <p>Comentario: ${comentario.comment}</p>
            `;
            comentarioPeliContainer.appendChild(comentarioElement);
        });
  
        comentarioPeliContainer.classList.remove('hidden');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new Comments();
  });
  