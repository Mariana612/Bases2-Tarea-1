
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
    var container4 = document.getElementsByClassName("contenedorDataSet")[0];

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
    var container4 = document.getElementsByClassName("contenedorDataSet")[0];

    container1.style.display = "none";
    container2.style.display = "flex";
    container3.style.display = "none";
    container4.style.display = "none";
}

function mostraOcultarI(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("contenedorDataSet")[0];

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

async function fetchDataset() {
    const baseUrl = 'http://localhost:3002'; // Set this to the correct base URL
    try {
        const response = await fetch(`${baseUrl}/alldataset`);
        const data = await response.json();
        if (response.ok) {

            data.forEach(dataset=>{
                const fotoString = dataset['Foto o avatar'] ? dataset['Foto o avatar'].toString() : '';
                const archivoString = dataset['Archivo(s)'] ? dataset['Archivo(s)'].toString() : '';
                
                var videoPath;
                var parts;
                var fileName;
                var rutaVideo;
                var rutaImg;
                var rutaFile;
                var inicioRuta = 'archivos/';

                videoPath = dataset.Video
                parts = videoPath.split('\\'); // Usa doble backslash para escapar correctamente en JavaScript
                
                fileName = parts.pop(); // Extrae el último elemento del array
                rutaVideo = inicioRuta + fileName;

                
                videoPath = fotoString //Aqui pone lo de la ruta de la imagen 
                parts = videoPath.split('\\'); // Usa doble backslash para escapar correctamente en JavaScript
                fileName = parts.pop(); // Extrae el último elemento del array
                rutaImg= inicioRuta +  fileName;
                

                videoPath = archivoString //Aqui pone lo de la ruta del archivo
                parts = videoPath.split('\\'); // Usa doble backslash para escapar correctamente en JavaScript
                fileName = parts.pop(); // Extrae el último elemento del array
                rutaFile= inicioRuta +  fileName;

                //se le da formato a la fecha
                const fechaOriginal = new Date(dataset['Fecha de Inclusión']);
                const dia = String(fechaOriginal.getDate()).padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
                const mes = String(fechaOriginal.getMonth() + 1).padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
                const año = fechaOriginal.getFullYear();

                const fechaFormateada = `${dia}-${mes}-${año}`;
                
                agregarDataSet(rutaImg, dataset.Nombre, dataset.Descripción, fechaFormateada, rutaFile, rutaVideo );
            });
            
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

async function insertarDataSet() {
    const username = document.getElementById("username").value;
    const descripcionOutput = document.getElementById("Descripcion").value;
    const avatarUserInput = document.getElementById("photoAvatar").files[0]; // Obtener el archivo de la foto/avatar
    const archivoInput = document.getElementById("archivosDatos").files[0]; // Obtener el archivo de datos
    const videoInput = document.getElementById("videoTuto").files[0];

    const idowner = 1; // por ahora esta esto fijo aquí
    const idownerString = idowner.toString(); // Convertir el número entero a cadena

    // Crear objeto FormData para enviar los datos y archivos
    const formData = new FormData();
    formData.append('photoAvatar', avatarUserInput); // Agregar la foto/avatar
    formData.append('archivosDatos', archivoInput); // Agregar el archivo de datos
    formData.append('videoTuto', videoInput);

    // Agregar los campos del requestBody al FormData
    formData.append('nombre', username);
    formData.append('descripcion', descripcionOutput);
    formData.append('idowner', idownerString); // idwoner

    try {
        const response = await fetch('http://localhost:3002/dataset', {
            method: 'POST',
            body: formData 
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

async function nuevoChat(idPerson){
    //lo añade a la lista de contactos de la persona
    console.log(idPerson);
    const username = await fetchName(idPerson);
    agregarContactoChat(username);

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

function agregarNuevoContacto(nombreChat, idUs){
    // Crear los elementos
    var containerDiv = document.createElement('div');
    containerDiv.className = 'cdrContactos';

    var header = document.createElement('h1');
    header.className = 'nomContactos';
    header.textContent = nombreChat;  

    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'btnEC';
    console.log('idUs:', idUs);  // Check the console to see what idUs actually contains before it's used
    button.setAttribute('onclick', 'nuevoChat(\'' + idUs + '\')');  // Using escaping 


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
        console.log(users); // Log the entire response to verify the structure
        if (response.ok) {
            users.forEach(user => {
                console.log(user.iduser); // Ensure you are logging the correct field name
                agregarNuevoContacto(user.username, user.iduser); // Correct the case to match your JSON structure
            });
        } else {
            console.error('Failed to fetch users:', users);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function agregarDataSet(rutaImagen, nombreUsuario, descripcion, fechaInclusion, rutaArchivoDat, rutaVideo){
    // Crear el contenedor principal
    var mainContainer = document.createElement('div');
    mainContainer.className = 'verDataSet';

    // Crear los subcontenedores datasetA y datasetC
    var datasetA = document.createElement('div');
    datasetA.className = 'datasetA';

    var datasetC = document.createElement('div');
    datasetC.className = 'datasetC';

    // Crear y llenar datasetA
    var cuadroDatsDS = document.createElement('div');
    cuadroDatsDS.className = 'cuadroDatsDS';
    datasetA.appendChild(cuadroDatsDS);

    var titleMV = document.createElement('h2');
    titleMV.className = 'tittleMV';
    titleMV.textContent = 'DATA SET';
    cuadroDatsDS.appendChild(titleMV);

    // Crear y llenar la parte de la imagen/avatar
    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    cuadroDatsDS.appendChild(avatarDiv);

    var img = document.createElement('img');
    img.id = 'fotoid';
    img.src = rutaImagen;  // Añadir la ruta de la imagen
    img.alt = 'Imagen de perfil';
    img.className = 'fotoPer';
    avatarDiv.appendChild(img);

    var labelAvatar = document.createElement('h3');
    labelAvatar.className = 'solDatosACom';
    labelAvatar.textContent = 'Foto o avatar';
    avatarDiv.appendChild(labelAvatar);

    // Función para crear infoIO
    function createInfoIO(className, label, id, infoLlena) {
        var infoDiv = document.createElement('div');
        infoDiv.className = 'infoIO';
        cuadroDatsDS.appendChild(infoDiv);

        var labelElement = document.createElement('h3');
        labelElement.className = 'solDatosCom';
        labelElement.textContent = label;
        infoDiv.appendChild(labelElement);

        var output = document.createElement('output');
        output.id = id;
        output.className = 'iDatDS';
        output.textContent = infoLlena;
        infoDiv.appendChild(output);

        return infoDiv;
    }

    createInfoIO('infoIO', 'Nombre:', 'username', nombreUsuario);
    createInfoIO('infoIO', 'Descripción:', 'Descripcion', descripcion);
    createInfoIO('infoIO', 'Fecha de inclusión:', 'fecha', fechaInclusion);
    createInfoIO('infoIO', 'Archivo con los datos:', 'archiId', rutaArchivoDat);

    // Añadir video
    var videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    cuadroDatsDS.appendChild(videoContainer);

    var video = document.createElement('video');
    video.controls = true;
    video.style.width = '100%';
    videoContainer.appendChild(video);

    var source = document.createElement('source');
    source.src = rutaVideo;  // Añadir la fuente del video
    source.type = 'video/mp4';
    video.appendChild(source);

    var videoNotSupported = document.createTextNode('Tu navegador no soporta el elemento de video.');
    video.appendChild(videoNotSupported);

    // Crear y llenar datasetC
    var titleMC = document.createElement('h4');
    titleMC.className = 'tittleMC';
    titleMC.textContent = 'COMENTARIOS';
    datasetC.appendChild(titleMC);

    var commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer';
    commentsContainer.className = 'cuadroDatsC';
    datasetC.appendChild(commentsContainer);

    var cuadroDatsC2 = document.createElement('div');
    cuadroDatsC2.className = 'cuadroDatsC2';
    datasetC.appendChild(cuadroDatsC2);

    var labelComment = document.createElement('h3');
    labelComment.className = 'solDatosCmt2';
    labelComment.textContent = 'Agregar comentario';
    cuadroDatsC2.appendChild(labelComment);

    var inputComment = document.createElement('input');
    inputComment.type = 'text';
    inputComment.id = 'newCommentInput';
    inputComment.className = 'iDatCmt2';
    cuadroDatsC2.appendChild(inputComment);

    var commentButton = document.createElement('button');
    commentButton.id = 'btnComen';
    commentButton.className = 'botonesC';
    commentButton.textContent = 'COMENTAR';
    commentButton.setAttribute('onclick', 'addComment()');  // Asegúrate de que la función addComment() esté definida
    cuadroDatsC2.appendChild(commentButton);

    // Ensamblar todo en el contenedor principal
    mainContainer.appendChild(datasetA);
    mainContainer.appendChild(datasetC);


    var targetContainer = document.querySelector('.contenedorDataSet'); 
    targetContainer.appendChild(mainContainer);
}

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


editarInfoP(1);
fetchDatasetsByOwnerId(1);
fetchDataset();//para ver los dataSet 

for (let i = 0; i < 5; i++) {
    agregarContactoChat('patito');
}
