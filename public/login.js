class Login {
  constructor() {  
    const loginForm = document.querySelector('#login-form');
    this.doLogin = this.doLogin.bind(this);
    loginForm.addEventListener('submit', this.doLogin);
  }

  doLogin(event) {
      event.preventDefault();
      const users = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const key = "CINEMAX - API"; //Clave privada de encriptacion
      const encryptedData = CryptoJS.AES.encrypt(data, key).toString() //encripta la clave antes de transmitirlo
      const loginBody = {
          username: users, 
          password: password
      };
      const fetchOptions = {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
         body: JSON.stringify(loginBody)
      };
      
      console.log(loginBody);
      
      return fetch('/login/', fetchOptions)
          .then(user =>   window.location.href = '/');
  }
}
// Init app
new Login();