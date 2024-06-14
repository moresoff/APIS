class Registro {
  constructor() {  
    const registroForm = document.querySelector('#registro-form');
    this.doRegistro = this.doRegistro.bind(this);
    registroForm.addEventListener('submit', this.doRegistro);
  }

  doRegistro(event) {
      event.preventDefault();
      const users = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const registroBody = {
          username: users, 
          password: password
      };
      const fetchOptions = {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
         body: JSON.stringify(registroBody)
      };
      
      console.log("registroBody");
   
      return fetch('/registro/', fetchOptions)
          .then(user =>   window.location.href = '/home.html');
  }
}
// Init app
new Registro();




