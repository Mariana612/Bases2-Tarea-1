
var fechaActual = new Date();
var formattedDate = ('0' + fechaActual.getDate()).slice(-2) + '/' + ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '/' + fechaActual.getFullYear();
document.getElementById('fechaInclu').textContent = formattedDate;

document.addEventListener('DOMContentLoaded', function() {
    someDataId = 1;
    fetchDataset(someDataId);  // Replace 'someDataId' with a specific dataset ID you want to load initially
});

window.onload = function() {
    var dato = sessionStorage.getItem('idUsuario'); // Obtienes el dato desde sessionStorage
    console.log(dato); // Usas el dato como necesites, por ejemplo, mostrarlo en consola

    // Opcional: limpiar el sessionStorage si el dato ya no es necesario
    //sessionStorage.removeItem('idUsuario');
};


function mostraOcultarP(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    container1.style.display = "flex";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "none";
}

function mostraOcultarSeeD(){
    var container1 = document.getElementsByClassName("cambiarDPerfil")[0];
    var container2 = document.getElementsByClassName("estadisticaData")[0];

    if(container1.style.display != "none"){
        container1.style.display = "none";
    }

    if(container2.style.display == "none"){
        container2.style.display = "flex";
    }
}


function mostraOcultarR(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    container1.style.display = "none";
    container2.style.display = "flex";
    container3.style.display = "none";
    container4.style.display = "none";
}


function mostraOcultarI(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    container1.style.display = "none";
    container2.style.display = "none";
    container3.style.display = "flex";
    container4.style.display = "flex";
}


function mostraOcultarEditP(){
    var container1 = document.getElementsByClassName("cambiarDPerfil")[0];
    var container2 = document.getElementsByClassName("estadisticaData")[0];

    if(container2.style.display != "none"){
        container2.style.display = "none";
    }

    if(container1.style.display == "none"){
        container1.style.display = "flex";
    }
}

async function fetchDataset(dataId) {
    const baseUrl = 'http://localhost:3002'; // Set this to the correct base URL
    try {
        const response = await fetch(`${baseUrl}/dataset/${dataId}`);
        const data = await response.json();
        if (response.ok) {
            displayDataset(data);
        } else {
            console.error('Dataset not found', data);
        }
    } catch (error) {
        console.error('Failed to fetch dataset:', error);
    }
}

function displayDataset(dataset) {
    // Assuming you have HTML elements with IDs to show these details
    document.getElementById('username').textContent = dataset.Nombre;
    document.getElementById('Descripcion').textContent = dataset.Descripción;
    document.getElementById('fecha').textContent = new Date(dataset['Fecha de Inclusión']).toLocaleDateString();

    // Update the video source if a video file is included in the dataset
    const videoContainer = document.querySelector('.video-container video source');
    if (dataset['Archivo(s)']) {
        const mp4File = dataset['Archivo(s)'].find(file => file.endsWith('.mp4'));
        if (mp4File) {
            videoContainer.src = mp4File.replace(/\\/g, '/'); // Replace backslashes with forward slashes for URL compatibility
        } else {
            videoContainer.src = ''; // Set to an empty string or a default placeholder if no valid video file is present
        }
    } else {
        videoContainer.src = ''; // Handle case where there are no files
    }

    const archivosElement = document.getElementById('archiId');
    if (dataset['Archivo(s)'] && dataset['Archivo(s)'].length > 0) {
        archivosElement.textContent = dataset['Archivo(s)'][0]; // Display the first URL
    } else {
        archivosElement.textContent = 'No file available'; // No file available
    }

    // Refresh the video load to update the source
    document.querySelector('.video-container video').load();

    const avatarImageElement = document.getElementById('fotoid');
    if (dataset['Foto o avatar']) {
        avatarImageElement.src = dataset['Foto o avatar'];
    } else {
        avatarImageElement.src = 'default-avatar.png'; // Use a default placeholder if no image is available
    }
}
function abrirChat(){
    var container1 = document.getElementsByClassName("cdrContacto")[0];
    var container2 = document.getElementsByClassName("cdrChats")[0];
    var container3 = document.getElementsByClassName("cdrEnviarMsg")[0];
    var container4 = document.getElementsByClassName("cdrChatsDispo")[0];

    container1.style.display = "flex";
    container2.style.display = "flex";
    container3.style.display = "flex";
    container4.style.display = "none";
}

async function insertarDataSet(){
        
    const username = document.getElementById("username").value;
    const descripcionOutput = document.getElementById("Descripcion").value;
    
    const requestBody = {
        nombre: username,
        descripcion: descripcionOutput,
        photo: "\Pagina3\imagenes\buscar.png",
        archivos:["\Pagina3\imagenes\buscar.png"]
    };

    try {
        const response = await fetch('http://localhost:3002/dataset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            console.log('Datos insertados correctamente');
        } else {
            console.error('Error al insertar datos:', response.statusText);
        }
    } catch (err) {
        console.error('Error de red:', err);
    }      

}


function volverChats(){
    var container1 = document.getElementsByClassName("cdrContacto")[0];
    var container2 = document.getElementsByClassName("cdrChats")[0];
    var container3 = document.getElementsByClassName("cdrEnviarMsg")[0];
    var container4 = document.getElementsByClassName("cdrChatsDispo")[0];

    container1.style.display = "none";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "flex";
}


async function editarInfoP(idUser){
    try{
        const response = await fetch(`http://localhost:3001/getIfo/${idUser}`);
        const userData = await response.json();

        const { nombre_completo, fecha_nacimiento, username, password_hash } = userData;

        var nombreCompleto = nombre_completo;
        console.log(nombreCompleto)
        var fechaNacimiento = fecha_nacimiento; // Formato: '2024-04-28'
        var usernameOut = username;
        var password = password_hash;
        var passwordInput = document.getElementById('passwordP');

        //Esto hace que se pueda ver la contraseña cuando se posiciona en el espacio
        passwordInput.addEventListener('focus', function() {
            this.type = 'text';  
        });

        passwordInput.addEventListener('blur', function() {
            this.type = 'password';  
        });        
        //Se muestra la info en la interfaz
        document.getElementById('fullNameP').value = nombreCompleto;
        document.getElementById('fechaNacP').value = fechaNacimiento; 
        document.getElementById('userNameP').value = usernameOut;
        passwordInput.value = password;
    
    } 
    
    catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
}

editarInfoP(1);


function updateInfoUser(idUser_pam) {
    const fullName = document.getElementById('fullNameP').value;
    const birthdate = document.getElementById('fechaNacP').value;
    const username = document.getElementById('userNameP').value;  // Ensure this ID matches your HTML
    const password = document.getElementById('passwordP').value;

    const requestBody = {
        idUser: idUser_pam,
        username: username,
        password_hash: password,
        nombre_completo: fullName,
        fecha_nacimiento: birthdate
    };

    fetch(`http://localhost:3001/getIfo/${idUser_pam}`, {
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
