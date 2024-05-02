
function mostraOcultarI(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    container1.style.display = "flex";
    container2.style.display = "none";
}


function mostraOcultarR(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    container1.style.display = "none";
    container2.style.display = "flex";
}

function fetchUserData() {
    const username = document.getElementById('usernameInput').value;
    const passwordHash = document.getElementById('passInput').value; // Assuming the password hash is retrieved from an input field

    fetch(`http://localhost:3001/users/${username}?passwordHash=${passwordHash}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.iduser) {
                sessionStorage.setItem('idUsuario', data.iduser);
                alert(data.iduser);

                window.location.href = "Pagina3/index.html";
            } else {
                console.error('User data is missing or the iduser is not available in the response');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.getElementById('userInfoDisplay').innerHTML = `Error: ${error.message}`;
        });
}

// var boton = document.getElementById("btnOlvidaC");

//     boton.addEventListener("click", function() {
//         sessionStorage.setItem('idUsuario', '3');
//         window.location.href = "Pagina3/index.html";
//     });


function insertNewUser() {
    const fullName = document.getElementById('fullNameInput').value;
    const birthdate = document.getElementById('birthdateInput').value;
    const username = document.getElementById('userInput').value;  // Ensure this ID matches your HTML
    const password = document.getElementById('passwordInput').value;
    const userPhoto = document.getElementById('fileId').files[0];

    console.log(fullName);
    console.log(birthdate);
    console.log(username);
    console.log(password);
    console.log(userPhoto);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password_hash', password);  // Assume you will hash it before sending or handle it securely
    formData.append('nombre_completo', fullName);
    formData.append('fecha_nacimiento', birthdate);
    formData.append('userPhoto', userPhoto);  // Add the file to the form data

    fetch('http://localhost:3001/addUser', {
        method: 'POST',
        body: formData  // Sending as FormData will set the appropriate Content-Type
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('User registered successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error registering user: ' + error.message);
    });
}

