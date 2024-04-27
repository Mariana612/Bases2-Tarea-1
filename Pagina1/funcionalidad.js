// var boton = document.getElementById("btnOlvidaC");

//     boton.addEventListener("click", function() {
//         sessionStorage.setItem('idUsuario', '3');
//         window.location.href = "Pagina3/index.html";
//     });


function mostraOcultarI(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    if(container2.style.display != "none"){
        container2.style.display = "none";
    }

    if(container1.style.display == "none"){
        container1.style.display = "flex";
    }else{
        container1.style.display = "none";
    }
}


function mostraOcultarR(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    if(container1.style.display != "none"){
        container1.style.display = "none";
    }

    if(container2.style.display == "none"){
        container2.style.display = "flex";
    }else{
        container2.style.display = "none";
    }
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
                sessionStorage.setItem('idUsuario', data.iduser.toString());
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

    const requestBody = {
        username: username,
        password_hash: password,
        nombre_completo: fullName,
        fecha_nacimiento: birthdate
    };

    fetch('http://localhost:3001/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();  // Change here to handle non-JSON text
    })
    .then(text => {
        try {
            const jsonData = JSON.parse(text);   // Try to parse the text as JSON
            console.log('Success:', jsonData);
            alert(jsonData.message);
        } catch (e) {
            throw new Error('Failed to parse JSON response: ' + text);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error registering user: ' + error.message);
    });
}

