class Login { /* creo la clase para capturar el usuario */
  constructor() {  
    const loginForm = document.querySelector('#login-form'); /* capturo el formulario donde se encuentran los datos */
    this.doLogin = this.doLogin.bind(this); /* */
    loginForm.addEventListener('submit', this.doLogin); /* creo el evento que se va a producir cuando "suba" los datos, redirije a la funcion doLogin */
    
  }

  doLogin(event) { /*creo la funcion que contiene el evento*/
      event.preventDefault();
      const key = "CINEMAX - API"; /*defino la clave, que es parte del encriptamiento (CryptoJS)*/
      const users = document.querySelector("#username").value; /*defino la variable que guarda al usuario, del imput username */
      const password = document.querySelector("#password").value; /*defino la variable que guarda la contraseña, del imput password */
     //AES encriptacion simetrica 
      const encryptedUsers = CryptoJS.AES.encrypt(users, key).toString(); /*Codigo de CrytoJs, encripta el usuario con la llave */
      const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString(); /*Codigo de CrytoJs, encripta la contraseña con la llave */
      const loginBody = { /*asocio las variables encriptadas con los documentos de MongoDB */
          username: encryptedUsers, 
          password: encryptedPassword,
      };
         // Configuración de la solicitud
      const fetchOptions = { /* */
         method: 'POST', /*envia datos al servidor de manera segura ya que no son visibles en la URL y no son visibles en el historial del navegador*/
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
         body: JSON.stringify(loginBody) /* lo datos se envian en un json*/
      };
      
      console.log(loginBody);
      
      return fetch('/login', fetchOptions) /* */
          .then(user =>   window.location.href = '/'); 
  }
}
// Init app
new Login();