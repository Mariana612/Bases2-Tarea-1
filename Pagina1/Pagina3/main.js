let rKey;
var fechaActual = new Date();
var formattedDate = ('0' + fechaActual.getDate()).slice(-2) + '/' + ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '/' + fechaActual.getFullYear();
document.getElementById('fechaInclu').textContent = formattedDate;



window.onload = function() {
    var dato = sessionStorage.getItem('idUsuario'); // Obtienes el dato desde sessionStorage
    console.log(dato); // Usas el dato como necesites, por ejemplo, mostrarlo en consola

    // Opcional: limpiar el sessionStorage si el dato ya no es necesario
    //sessionStorage.removeItem('idUsuario');
};


async function mostraOcultarP(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("contenedorDataSet")[0];

    container1.style.display = "flex";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "none";
    limpiarMensajeria();
    TestUsr();
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
        displayEditUser();
    }
    


} // TRABAJANDO ACA

async function displayEditUser() {
    const userId = sessionStorage.getItem('idUsuario');
    const apiUrl = `http://localhost:3001/usersId/${userId}`;

    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const userData = await response.json();
            console.log("Fetched user data:", userData);
            document.getElementById('fullNameP').value = userData.nombre_completo;
            const dateOfBirth = new Date(userData.fecha_nacimiento);
            document.getElementById('fechaNacP').value = dateOfBirth.toISOString().split('T')[0];
            document.getElementById('userNameP').value = userData.username;

            document.getElementById('userPhotoDisplay').src = userData.userphoto ? userData.userphoto.split('Pagina1\\Pagina3\\')[1].replace(/\\/g, '/') : 'Pagina1\\imagenes\\perfil.png';

        } else {
            console.error('Failed to fetch user data:', await response.text());
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


async function fetchDataset() {
    const baseUrl = 'http://localhost:3002'; // Set this to the correct base URL
    try {
        const response = await fetch(`${baseUrl}/alldataset`);
        const data = await response.json();
        if (response.ok) {

            data.forEach(dataset=>{
                displayDaset(dataset);
            });
            
        } else {
            console.error('Dataset not found', data);
        }
    } catch (error) {
        console.error('Failed to fetch dataset:', error);
    }
} 

function abrirChat(rowKey){
    

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
    limpiarMensajesChat();
    iniciarChat(rowKey);
}// abre el chat -- agregarConversacion(mensaje)

async function iniciarChat(rowKey) {
    rKey = rowKey;
   
    console.log(`Iniciando chat con rowKey: ${rowKey}`);

    // URL de la API configurada en HbaseApi.js para recuperar mensajes por rowKey
    const baseUrl = 'http://localhost:3004'; // Asegúrate de que este puerto coincida con el de tu servidor HbaseApi
    const url = `${baseUrl}/UserMessages/${encodeURIComponent(rowKey)}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const mensajes = await response.json();
            // Iterate over each message received and use agregarConversacion to display it
            mensajes.forEach(row => {
                row.cells.forEach(cell => {
                    // Here we assume the column follows the format 'msgs:x'
                    if (cell.column.startsWith('msgs:')) {
                        agregarConversacion(cell.value);
                    }
                });
            });
            console.log(`Mensajes cargados para rowKey: ${rowKey}`);
        } else {
            console.log(`No se encontraron mensajes para rowKey: ${rowKey}`);
        }
    } catch (error) {
        console.error(`Error al recuperar mensajes para rowKey: ${rowKey}:`, error);
    }
}

async function enviarMensaje(){
    const message = document.getElementById('txtarea').value; // Grab the content from the textarea
    if (!message) {
        console.log("No message to send.");
        return; // Do not proceed if there is no message
    }

    const baseUrl = 'http://localhost:3004'; // URL of your HBase API server
    const tableName = 'UserMessages'; // The table where messages are stored
    const columnFamily = 'msgs'; // The column family, adjust if different
    const columnQualifier = new Date().toISOString(); // Use ISO string timestamp as a column qualifier for uniqueness

    try {
        const response = await fetch(`${baseUrl}/hbase/putData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tableName,
                rowKey: rKey,
                columnFamily,
                columnQualifier,
                value: message
            })
        });

        if (response.ok) {
            console.log('Message sent successfully');
            document.getElementById('txtarea').value = ''; // Clear the textarea after successful send
            agregarConversacion(message);
        } else {
            console.error('Failed to send message:', await response.text());
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function insertarDataSet() {
    const username = document.getElementById("username").value;
    const descripcionOutput = document.getElementById("Descripcion").value;
    const avatarUserInput = document.getElementById("photoAvatar").files[0]; // Obtener el archivo de la foto/avatar
    const archivoInput = document.getElementById("archivosDatos").files[0]; // Obtener el archivo de datos
    const videoInput = document.getElementById("videoTuto").files[0];
    const idowner = sessionStorage.getItem('idUsuario');

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
} // no lo uso
    
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
} // no lo uso

async function addComment() {
        //const dataId = someDataId; // Ensure this is set correctly to the current dataset ID
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
            const username = await fetchName(comment.idUsuarioComment);
            commentDiv.innerHTML = `<h4 class="solDatosCmt">Username: </h4><output class="iDatCmt">${username} - ${comment.comentario}</output>`;
        } catch (error) {
            commentDiv.innerHTML = `<h4 class="solDatosCmt">Username: </h4><output class="iDatCmt">Error fetching username - ${comment.comentario}</output>`;
            console.error('Error fetching username:', error);
        }
    }


//async function addComment() {
//    const dataId = someDataId; // Ensure this is set correctly to the current dataset ID
//    const commentInput = document.getElementById('newCommentInput');
//    const commentText = commentInput.value;
//    const baseUrl = 'http://localhost:3002';
//    alert(sessionStorage.getItem('idUsuario'));
//    idu = parseInt(sessionStorage.getItem('idUsuario'));
//    const commentData = {
//        idDataset: dataId,
//        idUsuarioComment: idu, // Assuming the user ID is stored in sessionStorage
        
//        comentario: commentText
//    };

//    try {
//        const response = await fetch(`${baseUrl}/comments`, {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(commentData)
//        });

//        if (response.ok) {
            // Clear input after successful submission
//            commentInput.value = '';
            // Refresh comments to show the new one
//            fetchComments(dataId);
//        } else {
//            console.error('Failed to post comment');
//        }
//    } catch (error) {
//        console.error('Error posting comment:', error);
//    }
//}
    


async function volverChats(){
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


} // vuelve al menu principal


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

    limpiarNuevosContactos();
    fetchAndAddAllUsers();
} // permite que el voton de NUEVA CONVERSACION sirva

async function muestraMensajeria(){
const idPerson = sessionStorage.getItem('idUsuario'); // Assuming 'idUsuario' is the current user's ID
const baseUrl = 'http://localhost:3004'; // Make sure this matches your API server's address
try {
    const response = await fetch(`${baseUrl}/hbase/search/UserMessages/${idPerson}`);
    const rowKeys = await response.json();
    if (rowKeys.length > 0) {
        rowKeys.forEach(async (rowKey) => {
            // Split the row key on '#'
            const parts = rowKey.split('#');
            // Determine the part of the rowKey that is not the user's ID
            const otherId = parts.find(part => part !== idPerson);
            if (otherId) {
                const username = await fetchName(otherId);
                agregarContactoChat(username, rowKey); // This function should handle displaying or processing the contact
            }
        });
    } else {
        console.log("No rows found containing the ID:", idPerson);
    }
} catch (error) {
    console.error('Error fetching data:', error);
}
} // muestra al inicioen mensajeria
muestraMensajeria();

async function nuevoChat(idPerson){
    //lo añade a la lista de contactos de la persona
    console.log(idPerson);
    const currentUserId = sessionStorage.getItem('idUsuario');
    const username = await fetchName(idPerson);
    //se tiene que crear el nuevo rowkey
    agregarContactoChat(username);
    const potentialRowKey = `${currentUserId}#${idPerson}`;

    
    agregarConversacion("este es el inicio de un chat");
    abrirChat(potentialRowKey);

} //crea nuevo chat cuando se presiona el boton en BUSCAR NUEVO CONTACTO

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
    
}// no lo uso


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
} // no lo uso

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
} // no lo uso

function agregarContactoChat(nombreChat, rowKey){
    // Crear los divs
    var containerDiv = document.createElement('div');
    containerDiv.className = 'cdrContactos';

    var header = document.createElement('h1');
    header.className = 'nomContactos';
    header.textContent = nombreChat;  // Ajusta el nombre como necesario

    var button = document.createElement('button');
    button.type = 'submit';
    button.className = 'btnEC';
    button.setAttribute('onclick', 'abrirChat(\'' + rowKey + '\')');  

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

} // MENSAJERIA los agrega


function agregarConversacion(mensaje){

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
}   // ENVAIR MENSAJE no lo necesita ftm

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
} // agrega todas las cosas cosas en BUSCAR NUEVO CONTACTO


fetchDatasetsByOwnerId(1); //esto despliiega las varas del user

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
}// no se necesita


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
}//no se necesita

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
}// no se necesita 


async function fetchAndAddAllUsers() {
    const userApiBaseUrl = 'http://localhost:3001'; // Adjust to your actual User API base URL
    const hbaseBaseUrl = 'http://localhost:3004'; // URL of your HBase API server

    try {
        const response = await fetch(`${userApiBaseUrl}/allUsers`);
        const users = await response.json();
        if (response.ok) {
            for (const user of users) {
                const currentUserId = sessionStorage.getItem('idUsuario');
                const potentialRowKey = `${currentUserId}#${user.iduser}`;

                // Check if a row with this key exists in HBase
                const checkResponse = await fetch(`${hbaseBaseUrl}/hbase/getData/UserMessages/${encodeURIComponent(potentialRowKey)}`);
                
                if (checkResponse.ok) {
                    const data = await checkResponse.json();
                    if (data.length === 0) {
                        console.log(`No data found for row key: ${potentialRowKey}, adding contact`);
                        agregarNuevoContacto(user.username, user.iduser);
                    } else {
                        console.log(`Row key exists: ${potentialRowKey}, skipping`);
                    }
                } else {
                    // Handle non-200 responses gracefully
                    console.log(`No data found for row key: ${potentialRowKey}, adding contact due to error or non-existence`);
                    agregarNuevoContacto(user.username, user.iduser);
                }
            }
        } else {
            console.error('Failed to fetch users:', users);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }}

function agregarDataSet(rutaImagen, nombreUsuario, descripcion, fechaInclusion, rutaArchivoDat, rutaVideo,idData){
    console.log(idData);
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

    // Añadir botón de descarga
    var descargaDiv = document.createElement('div');
    descargaDiv.className = 'cdrBotonDescarga';
    var descargaButton = document.createElement('button');
    descargaButton.id = 'btnDescargar';
    descargaButton.className = 'botonesDes';
    descargaButton.textContent = 'DESCARGAR';

    // Set up the onclick handler to call descargarDataSet with idData
    descargaButton.onclick = function() { descargarDataSet(idData); };

    descargaDiv.appendChild(descargaButton);
    cuadroDatsDS.appendChild(descargaDiv);

    // Crear y llenar datasetC
    var titleMC = document.createElement('h4');
    titleMC.className = 'tittleMC';
    titleMC.textContent = 'COMENTARIOS';
    datasetC.appendChild(titleMC);

    var commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer' + idData.toString();
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
    inputComment.id = 'newCommentInput' + idData.toString();
    inputComment.className = 'iDatCmt2';
    cuadroDatsC2.appendChild(inputComment);

    var commentButton = document.createElement('button');
    commentButton.id = 'btnComen' + idData.toString();
    commentButton.className = 'botonesC';
    commentButton.textContent = 'COMENTAR';
    commentButton.setAttribute('onclick', 'addComment()');  // Asegúrate de que la función addComment() esté definida
    cuadroDatsC2.appendChild(commentButton);

    // Ensamblar todo en el contenedor principal
    mainContainer.appendChild(datasetA);
    mainContainer.appendChild(datasetC);


    var targetContainer = document.querySelector('.contenedorDataSet'); 
    targetContainer.appendChild(mainContainer);
}  // cosas de pame
  
async function updateUserInfo() {
    const userId = sessionStorage.getItem('idUsuario');  // Assuming you store the user ID in sessionStorage
    const fullName = document.getElementById('fullNameP').value;
    const birthDate = document.getElementById('fechaNacP').value;
    const username = document.getElementById('userNameP').value;
    const password = document.getElementById('passwordP').value;
    const archivoInput = document.getElementById("fileid").files[0];

    // Hash the password here if necessary before sending it to the server

    const formData = new FormData();
    formData.append('idUser', userId);
    formData.append('nombre_completo', fullName);
    formData.append('fecha_nacimiento', birthDate);
    formData.append('username', username);
    formData.append('userPhoto', archivoInput);
    formData.append('password_hash', password);

    const response = await fetch('http://localhost:3001/updateUser', {
        method: 'POST',
        body: formData  // No headers needed; FormData sets the appropriate Content-Type
    });

    if (response.ok) {
        console.log('User info updated successfully');
    } else {
        console.error('Failed to update user info', await response.text());
    }
} //ESTOY TRABAJANDO AQUI

async function buscarDataset() {
    limpiarContenedorData(); // Assuming this function correctly clears the display area
    console.log("Started buscarDataset");
    const criterioBusInput = document.getElementById("criterioBusInpu").value;
    const baseUrl = 'http://localhost:3002'; // Base URL for dataset API
    let flag1 = 0;

    try {
        
        console.log("Making API call to fetch datasets");
        const response = await fetch(`${baseUrl}/alldataset`);
        if (!response.ok) throw new Error('Failed to fetch datasets');

        const datasets = await response.json();
        console.log("Datasets fetched", datasets);

        datasets.forEach(dataset => {
            if (dataset.Nombre === criterioBusInput) {
                console.log("Displaying dataset", dataset);
                displayDaset(dataset);
                flag1 =1;
            }
            
        });
        console.log(flag1);
        if(flag1==0){
            throw new Error('Not id');
        }

        
    
    } catch (error) {
        //console.error('Failed to fetch dataset or user ID:', error);
        buscarDataset2(criterioBusInput);
    }
}
async function buscarDataset2(criterioBusInput) {    
    const baseUrl = 'http://localhost:3002'; // Base URL for dataset API    
    try {
        // First, attempt to retrieve the user ID based on the username
        const userId = await getidUsername(criterioBusInput);

        // If no valid user ID, log and exit the function
        if (!userId) {
            console.log('No valid user ID found');
            return;
        }

        // Fetch all datasets (assuming all datasets need to be fetched regardless)
        const response = await fetch(`${baseUrl}/alldataset`);
        if (!response.ok) throw new Error('Failed to fetch datasets');

        const datasets = await response.json();

        // Display datasets that match the user ID or dataset name
        
        datasets.forEach(dataset => {
            if (dataset.Nombre === criterioBusInput || dataset.OwnerId === userId) {
                displayDaset(dataset);
            }
        });

    }     catch(error){
        console.error('Failed to fetch dataset or user ID:', error);
        }
    }

function displayDaset(dataset){
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
    
    agregarDataSet(rutaImg, dataset.Nombre, dataset.Descripción, fechaFormateada, rutaFile, rutaVideo,dataset.DatasetId );    
}

editarInfoP(1);
fetchDataset();//para ver los dataSet 

function limpiarMensajeria(){
    var contenedor = document.getElementById('idCdrChatsDispo');

    var divsParaEliminar = contenedor.querySelectorAll('.cdrContactos');

    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });

} // limpia mensajeria principal

function limpiarMensajesChat() {
    var contenedor = document.getElementById('idCdrChats');

    var divsParaEliminar = contenedor.querySelectorAll('.cdrMsg');

    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });
}

function limpiarNuevosContactos(){
    var contenedor = document.getElementById('idCdrChatsB');

    var divsParaEliminar = contenedor.querySelectorAll('.cdrContactosB');

    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });

} // eliumina nuevos contactos

function limpiarDataSet(){
    var contenedor = document.getElementById('idMarcoDataS');

    var divsParaEliminar = contenedor.querySelectorAll('.cdrDataS');

    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });
    
} // limpia dataset del perfil

function limpiarTablaData(){
    var contenedor = document.getElementById('idContenidoTabla');

    var divsParaEliminar = contenedor.querySelectorAll('.contenidoData');

    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });

} //limpia tabla

//funcion de obtener el id del user 
async function getidUsername(username) {
    const userApiBaseUrl = 'http://localhost:3001';
    try {
        const response = await fetch(`${userApiBaseUrl}/getuser/${encodeURIComponent(username)}`);
        if (!response.ok) {
            console.log(`No user found with username ${username}`);
            return null;  // Ensure this logic is correctly handling non-OK responses
        }
        const userData = await response.json();
        return userData.iduser;  // Make sure the key here matches exactly with your database column names
    } catch (error) {
        console.error(`Error fetching username for user ID ${username}:`, error);
        return null;
    }
}

function limpiarContenedorData(){
    // Seleccionar el contenedor por su ID
    var contenedor = document.getElementById('contenedorDataSetV');

    // Seleccionar todos los divs con la clase 'verDataSet' dentro del contenedor
    var divsParaEliminar = contenedor.querySelectorAll('.verDataSet');

    // Iterar sobre la colección de divs y eliminar cada uno
    divsParaEliminar.forEach(function(div) {
        contenedor.removeChild(div);
    });

} //limpia el "Ver Data Set"

function descargarDataSet(idData){
    console.log("Downloading dataset with ID:", idData);
    //limpiarContenedorData();
}

function agregarComentarioDataSet(userName, comentario, idData){
    // Crear los elementos
    var divComentarioHecho = document.createElement("div");
    var h1ComUser = document.createElement("h1");
    var divComTexto = document.createElement("div");

    // Establecer clases CSS
    divComentarioHecho.className = "comentarioHecho";
    h1ComUser.className = "comUser";
    divComTexto.className = "comTexto";

    // Añadir contenido
    h1ComUser.textContent = userName;
    divComTexto.textContent = comentario;

    // Anidar los elementos
    divComentarioHecho.appendChild(h1ComUser);
    divComentarioHecho.appendChild(divComTexto);

    // Obtener el contenedor y añadir el elemento creado
    var contenedorComData = 'commentsContainer' + idData.toString();
    var commentsContainer = document.getElementById(contenedorComData);
    commentsContainer.appendChild(divComentarioHecho);

} //agregarComentarioDataSet('userName', 'comentario', 1)
