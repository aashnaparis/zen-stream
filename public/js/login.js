
function showMod() {
  const loginModal = document.getElementById('login');
  const logintouch = document.getElementById('loginBtn');
  


  const closeButtons = document.querySelectorAll('.close');

  if (logintouch) {
    logintouch.onclick = function () {
      loginModal.style.display = 'flex';
      loginModal.style.justifyContent = 'center';
      // loginModal.style.alignItems = 'center';
      
    }
  }

  closeButtons.forEach(button => {
    button.onclick = function () {
      loginModal.style.display = 'none';
    }
  });

  window.onclick = function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    } 
  }

}

//function for email to differentiate
function isGovEmail(email) {
  return /^[^@]+@[^@]+\.gov$/i.test(email);
}

//for email validation
function valid(mail) {
  const input = document.createElement("input");
  input.type = "email";
  input.value = mail;
  return input.checkValidity();
}

//make sure all fields are entered correctly
function verifyLogin() {

  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
    });

  var email = document.getElementById("login-email");
  var username = document.getElementById("login-username");
  var password = document.getElementById("login-password");


  if (username.value === null || username.value === "") {
    document.getElementById("error").innerHTML="Put valid username in!";
    return false;
  } else if (password.value === null || password.value === "") {
    document.getElementById("error").innerHTML="Put valid password in!";
    return false;
  } else if (
    !valid(email.value) ||
    email.value === "" ||
    email.value === null
  ) {
    document.getElementById("error").innerHTML=("Put an Valid Email!");
    return false;
  } else {
    console.log("success");
    loginUser();
  }
}

async function loginUser() {
  var username = document.getElementById('login-username').value;
  var password = document.getElementById('login-password').value;
  var email = document.getElementById('login-email').value;


  var requestBody = {
    "username": username,
    "password": password,
    "email": email
  }

  var settings = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(requestBody)
  };


  try {
    var response = await fetch("/api/login", settings)

    if (response.status != 201) {
      document.getElementById("error").innerHTML=("Login failed, check you email/username/password");
    }
    else {
      var responseBody = await response.json();
      console.log(responseBody);
      alert(`Welcome, ${responseBody.username}! You're logged in`);
      localStorage.setItem("token", responseBody.token);

      window.location.href = "/index.html"
    }
  } catch (err) {
    console.error("Error logging in, err");
  }
}