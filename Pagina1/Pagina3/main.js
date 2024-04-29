
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
    fetchComments(dataset.DatasetId);
}
function abrirChat(){
    var container1 = document.getElementsByClassName("cdrContacto")[0];
    var container2 = document.getElementsByClassName("cdrChats")[0];
    var container3 = document.getElementsByClassName("cdrEnviarMsg")[0];

    var container4 = document.getElementsByClassName("cdrChatsDispo")[0];
    var container8 = document.getElementsByClassName("cdrBuscarNuevoChat")[0];

    var container5 = document.getElementsByClassName("cdrContactoB")[0];
    var container6 = document.getElementsByClassName("cdrChatsB")[0];
    var container7 = document.getElementsByClassName("cdrVolverChatsDispo")[0];


    container1.style.display = "flex";
    container2.style.display = "flex";
    container3.style.display = "flex";
    container4.style.display = "none";
    container5.style.display = "none";
    container6.style.display = "none";
    container7.style.display = "none";
    container8.style.display = "none";
}


    async function fetchComments(dataId) {
        const baseUrl = 'http://localhost:3002';
        try {
            const response = await fetch(`${baseUrl}/comments/${dataId}`);
            const comments = await response.json();
            if (response.ok) {
                displayComments(comments);
            } else {
                console.error('Comments not found', comments);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }
    
    async function displayComments(comments) {
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = ''; // Clear previous comments
    
        for (const comment of comments) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'infoCom';
    
            // Fetch the username asynchronously and then display the comment
            try {
                const username = await fetchName(comment.idUsuarioComment);
                commentDiv.innerHTML = `<h4 class="solDatosCmt">Username: </h4><output class="iDatCmt">${username} - ${comment.comentario}</output>`;
            } catch (error) {
                commentDiv.innerHTML = `<h4 class="solDatosCmt">Username: </h4><output class="iDatCmt">Error fetching username - ${comment.comentario}</output>`;
                console.error('Error fetching username:', error);
            }
    
            commentsContainer.appendChild(commentDiv);
        }
    }

    async function addComment() {
        const dataId = someDataId; // Ensure this is set correctly to the current dataset ID
        const commentInput = document.getElementById('newCommentInput');
        const commentText = commentInput.value;
        const baseUrl = 'http://localhost:3002';
        alert(sessionStorage.getItem('idUsuario'));
        idu = parseInt(sessionStorage.getItem('idUsuario'));
        const commentData = {
            idDataset: dataId,
            idUsuarioComment: idu, // Assuming the user ID is stored in sessionStorage
            
            comentario: commentText
        };
    
        try {
            const response = await fetch(`${baseUrl}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
    
            if (response.ok) {
                // Clear input after successful submission
                commentInput.value = '';
                // Refresh comments to show the new one
                fetchComments(dataId);
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }
function volverChats(){
    var container1 = document.getElementsByClassName("cdrContacto")[0];
    var container2 = document.getElementsByClassName("cdrChats")[0];
    var container3 = document.getElementsByClassName("cdrEnviarMsg")[0];

    var container4 = document.getElementsByClassName("cdrChatsDispo")[0];
    var container8 = document.getElementsByClassName("cdrBuscarNuevoChat")[0];

    var container5 = document.getElementsByClassName("cdrContactoB")[0];
    var container6 = document.getElementsByClassName("cdrChatsB")[0];
    var container7 = document.getElementsByClassName("cdrVolverChatsDispo")[0];

    container1.style.display = "none";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "flex";
    container5.style.display = "none";
    container6.style.display = "none";
    container7.style.display = "none";
    container8.style.display = "flex";
}


function verNuevosChats(){ 
    var container1 = document.getElementsByClassName("cdrContacto")[0];
    var container2 = document.getElementsByClassName("cdrChats")[0];
    var container3 = document.getElementsByClassName("cdrEnviarMsg")[0];

    var container4 = document.getElementsByClassName("cdrChatsDispo")[0];
    var container8 = document.getElementsByClassName("cdrBuscarNuevoChat")[0];

    var container5 = document.getElementsByClassName("cdrContactoB")[0];
    var container6 = document.getElementsByClassName("cdrChatsB")[0];
    var container7 = document.getElementsByClassName("cdrVolverChatsDispo")[0];

    container1.style.display = "none";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "none";
    container5.style.display = "flex";
    container6.style.display = "flex";
    container7.style.display = "flex";
    container8.style.display = "none";

    fetchAndAddAllUsers();
}


function nuevoChat(){
    //lo añade a la lista de contactos de la persona

    abrirChat();
}




function editarInfoP(){
    var nombreCompleto;
    var fechaNacimiento; // Formato: '2024-04-28'
    var username;
    var password;
    var passwordInput = document.getElementById('passwordP');

    //Esto hace que se pueda ver la contraseña cuando se posiciona en el espacio
    passwordInput.addEventListener('focus', function() {
        this.type = 'text';  
    });

    passwordInput.addEventListener('blur', function() {
        this.type = 'password';  
    });


    //Aquí le asigna la info a la variable 
    
    //Se muestra la info en la interfaz
    document.getElementById('fullNameP').value = nombreCompleto;
    document.getElementById('fechaNacP').value = fechaNacimiento; 
    document.getElementById('userNameP').value = username;
    passwordInput.value = password;
    
}


function agregarDataSetPerfil(nombreDelDataSet, idtabla){
    // Crear los divs
    var containerDiv = document.createElement('div');
    containerDiv.className = 'cdrDataS';

    var header = document.createElement('h1');
    header.className = 'nomDataS';
    header.textContent = nombreDelDataSet;

    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'btnVDS';
    button.setAttribute('onclick', 'fetchAndDisplayUserStats(' + idtabla + ')');

    var image = document.createElement('img');
    image.src = 'imagenes/ojo.png'; 
    image.className = 'btnVDSI';

    // Unir los elementos
    button.appendChild(image);
    containerDiv.appendChild(header);
    containerDiv.appendChild(button);

    // Seleccionar el contenedor donde se insertarán el div creado 
    var targetContainer = document.querySelector('.marcoDataS');

    // Agregar el div contenedor al elemento seleccionado
    targetContainer.appendChild(containerDiv);
}


function agregarFilaTablaHistorial(username, cantDescargas){
    // Crear los divs
    var mainDiv = document.createElement('div');
    mainDiv.className = 'contenidoData';

    var userColumnDiv = document.createElement('div');
    userColumnDiv.className = 'columnaUserD';
    var userHeader = document.createElement('h1');
    userHeader.className = 'textoTabla';
    userHeader.textContent = username;  // Cambia el texto según sea necesario
    userColumnDiv.appendChild(userHeader);

    var countColumnDiv = document.createElement('div');
    countColumnDiv.className = 'columnaCantDesD';
    var countHeader = document.createElement('h1');
    countHeader.className = 'textoTabla';
    countHeader.textContent = cantDescargas;  // Cambia el número según sea necesario
    countColumnDiv.appendChild(countHeader);

    // Unir los elementos
    mainDiv.appendChild(userColumnDiv);
    mainDiv.appendChild(countColumnDiv);

    // Seleccionar el contenedor donde se insertarán los elementos
    var targetContainer = document.querySelector('.contenidoTabla'); 

    // Agregar el div contenedor al elemento seleccionado
    targetContainer.appendChild(mainDiv);
}


function agregarContactoChat(nombreChat){
    // Crear los divs
    var containerDiv = document.createElement('div');
    containerDiv.className = 'cdrContactos';

    var header = document.createElement('h1');
    header.className = 'nomContactos';
    header.textContent = nombreChat;  // Ajusta el nombre como necesario

    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'btnEC';
    button.setAttribute('onclick', 'abrirChat()');  

    var image = document.createElement('img');
    image.src = 'imagenes/chat.png';  // Verifica que la ruta de la imagen sea correcta
    image.className = 'btnECI';

    // Unir los elementos
    button.appendChild(image);
    containerDiv.appendChild(header);
    containerDiv.appendChild(button);

    // Seleccionar el contenedor donde se insertarán los elementos
    var targetContainer = document.querySelector('.cdrChatsDispo'); 

    // Agregar el div contenedor al elemento seleccionado
    targetContainer.appendChild(containerDiv);

}


function agregarConversacion(nombreChat, mensaje){
    //Actualiza el nombre del contacto
    document.getElementById('nombreContactoMsg').textContent = nombreChat;

   // Crear los elementos
    var mainDiv = document.createElement('div');
    mainDiv.className = 'cdrMsg';

    var messageDiv = document.createElement('div');
    messageDiv.className = 'cdrMensaje';

    var message = document.createElement('h5');
    message.className = 'mensaje';
    message.textContent = mensaje;  // Puedes modificar el mensaje aquí
    
    // Ensamblar los elementos
    messageDiv.appendChild(message);
    mainDiv.appendChild(messageDiv);

    // Seleccionar el contenedor donde se insertarán los elementos
    var targetContainer = document.querySelector('.cdrChats'); 

    // Agregar el div contenedor al elemento seleccionado
    targetContainer.appendChild(mainDiv);
}


function agregarNuevoContacto(nombreChat){
    // Crear los elementos
    var containerDiv = document.createElement('div');
    containerDiv.className = 'cdrContactos';

    var header = document.createElement('h1');
    header.className = 'nomContactos';
    header.textContent = nombreChat;  

    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'btnEC';
    button.setAttribute('onclick', 'nuevoChat()');  

    var image = document.createElement('img');
    image.src = 'imagenes/iniciarConver.png';  
    image.className = 'btnECI';

    // Ensamblar los elementos
    button.appendChild(image);
    containerDiv.appendChild(header);
    containerDiv.appendChild(button);

    // Seleccionar el contenedor donde se insertarán los elementos
    var targetContainer = document.querySelector('.cdrChatsB'); 

    // Agregar el div contenedor al elemento seleccionado
    targetContainer.appendChild(containerDiv);
}


fetchDatasetsByOwnerId(1);

async function fetchDatasetsByOwnerId(ownerId) {
    const baseUrl = 'http://localhost:3002'; // Set this to the correct base URL
    try {
        const response = await fetch(`${baseUrl}/datasetOwner/${ownerId}`);
        const datasets = await response.json();
        if (response.ok) {
            datasets.forEach(dataset => {
                texto = dataset.Nombre + " "+ dataset.DatasetId;
                agregarDataSetPerfil(texto, dataset.DatasetId);
            });
        } else {
            console.error('No datasets found for this owner', datasets);
        }
    } catch (error) {
        console.error('Failed to fetch datasets:', error);
    }
}

async function fetchAndDisplayUserStats(datasetID) {
    const redisBaseUrl = 'http://localhost:3003'; // Adjust to your actual Redis API base URL

    try {
        // Fetch the array of user IDs
        const response = await fetch(`${redisBaseUrl}/dataset/users/${datasetID}`);
        const result = await response.json();
        if (response.ok && result.userIDs) {
            // Count occurrences of each userID
            const counts = result.userIDs.reduce((acc, userID) => {
                acc[userID] = (acc[userID] || 0) + 1;
                return acc;
            }, {});

            // For each unique user ID, fetch the username and update the table
            for (const [userID, count] of Object.entries(counts)) {
                const username = await fetchName(userID);
                if (username) {
                    agregarFilaTablaHistorial(username, count);
                } else {
                    console.error(`Failed to fetch username for user ID ${userID}`);
                }
            }
        } else {
            console.error('No user IDs found or error in response:', result);
        }
    } catch (error) {
        console.error('Failed to fetch user IDs:', error);
    }
}


async function fetchName(idUs) {
    const userApiBaseUrl = 'http://localhost:3001'; // Adjust to your actual User API base URL
    try {
        const userResponse = await fetch(`${userApiBaseUrl}/usersId/${idUs}`);
        if (userResponse.ok) {
            const userData = await userResponse.json();
            return userData.username; // Ensure that your API returns 'username' in the response
        } else {
            console.error(`Failed to fetch username for user ID ${idUs}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching username for user ID ${idUs}:`, error);
        return null;
    }
}

async function fetchAndAddAllUsers() {
    const userApiBaseUrl = 'http://localhost:3001'; // Adjust to your actual User API base URL

    try {
        const response = await fetch(`${userApiBaseUrl}/allUsers`);
        const users = await response.json();
        if (response.ok) {
            users.forEach(user => {
                agregarNuevoContacto(user.username);
            });
        } else {
            console.error('Failed to fetch users:', users);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}