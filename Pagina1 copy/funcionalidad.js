
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
    fetch(`http://localhost:3001/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('userInfoDisplay').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.getElementById('userInfoDisplay').innerHTML = `Error: ${error.message}`;
        });
}