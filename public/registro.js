class Registro {
  constructor() {  
    const registroForm = document.querySelector('#registro-form');
    this.doRegistro = this.doRegistro.bind(this);
    registroForm.addEventListener('submit', this.doRegistro);
  }

  doRegistro(event) {
      event.preventDefault();
      const key = "CINEMAX - API";
      const users = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const encryptedUsers = CryptoJS.AES.encrypt(users, key).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
      const registroBody = {
          username: encryptedUsers, 
          password: encryptedPassword,
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
          .then(user =>   window.location.href = '/');
  }
}
// Init app
new Registro();




