<script>
import { initializeApp } from "firebase/app";
import { ref, push, child, get, set, getDatabase, onValue, update } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { createEventDispatcher } from "svelte";


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
const dispatch = createEventDispatcher();
let email, password, username;

async function register() {
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

  const snapshot = await get(ref(database, 'users/' + username));

    if (snapshot.exists()){
      alert("Username already in use. Please create a new one!");
      return;
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
    alert('User Created!!');
    dispatch("login", true);
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
    const database_ref = ref(database);

    // DOne
    alert('User Logged In!!');
    dispatch("login", true);

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
 .pads{
  height:5%;
 }

 .button__container{
  display: grid;

 }
</style>



<div class="card w-3/4 h-max bg-white shadow-xl">
  <!-- random cat image generated -->
  <figure><img src="https://cataas.com/cat" alt="Image" /></figure>
  <div class="card-body">
    <h2 class="card-title">
      Authentication
    </h2>
    <div>
      <input type="text" id="email" placeholder="Your email" class="input input-bordered input-secondary w-full h-1/2 max-w-xs bg-grey" />
      <div class="pads"></div>
      <input type="text" id="username" placeholder="Your username" class="input input-bordered input-secondary w-full h-1/2 max-w-xs bg-grey" />
      <div class="pads"></div>
      <input type="password" id="password" placeholder="Your password" class="input input-bordered input-secondary w-full h-1/2 max-w-xs bg-grey" />
      <div class="pads"></div>
      

      <button class="btn btn-secondary" on:click={register}> Sign up </button>
      <button class="btn btn-secondary" on:click={login}> Log in </button>
    </div>
  </div>
</div>