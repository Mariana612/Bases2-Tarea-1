
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

    container1.style.display = "flex";
    container2.style.display = "flex";
    container3.style.display = "flex";
    container4.style.display = "none";
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
    
    function displayComments(comments) {
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = ''; // Clear previous comments
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'infoCom';
            commentDiv.innerHTML = `<h4 class="solDatosCmt">Username: </h4><output class="iDatCmt">${comment.idUsuarioComment} - ${comment.comentario}</output>`;
            commentsContainer.appendChild(commentDiv);
        });
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

    container1.style.display = "none";
    container2.style.display = "none";
    container3.style.display = "none";
    container4.style.display = "flex";
}

