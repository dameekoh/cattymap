<script>
  import { initializeApp } from "firebase/app";
  import { ref, push, child, get, set, getDatabase, onValue, update } from 'firebase/database';
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
  
  
  const firebaseConfig = {
    apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
    authDomain: "cattymap-1b9a3.firebaseapp.com",
    projectId: "cattymap-1b9a3",
    storageBucket: "cattymap-1b9a3.appspot.com",
    messagingSenderId: "368074086145",
    appId: "1:368074086145:web:393f103f6ca32a06bbad00",
    measurementId: "G-442J384EW1",
    databaseURL: 'https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/',
    };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  let email, password, username;
  
  function register() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    username = document.getElementById('username').value
    
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Please input the right email and password')
      return
      // Don't continue running the code
    }
    if (validate_field(username) == false) {
      alert('Please input the username')
      return
    }
   
    // Move on with Auth
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Declare user constiable
      const user = userCredential.user;
  
      // Add this user to Firebase Database
      const database_ref = ref(database)
  
      // Create User data
      const user_data = {
        email : email,
        username : username,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      set(ref(database, 'users/' + user.uid), user_data);
  
      // DOne
      alert('User Created!!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const error_code = error.code
      const error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Declare user constiable
      const user = userCredential.user;
  
      // Add this user to Firebase Database
      const database_ref = ref(database)
  
      // Create User data
      // const user_data = {
      //   last_login : Date.now()
      // }
  
      // Push to Firebase Database
      // set(ref(database, 'users/' + user.uid), user_data);
  
      // DOne
      alert('User Logged In!!')
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const error_code = error.code
      const error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }
  </script>
  
  <style>
  
  </style>
  
  
  
  <div class="card w-96 bg-base-100 shadow-xl">
    <figure><img src="https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg" alt="Image" /></figure>
    <div class="card-body">
      <h2 class="card-title">
        Authentication
      </h2>
      <div>
        <input type="text" id="email" placeholder="Your email" class="input input-bordered input-secondary w-full max-w-xs" />
        <input type="text" id="username" placeholder="Your username" class="input input-bordered input-secondary w-full max-w-xs" />
        <input type="text" id="password" placeholder="Your password" class="input input-bordered input-secondary w-full max-w-xs" />
      
          <button class="btn btn-secondary" on:click={register}> Sign up </button>
          <button class="btn btn-secondary" on:click={login}> Log in </button>
      </div>
    </div>
  </div>
  