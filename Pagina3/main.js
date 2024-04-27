
var fechaActual = new Date();
var formattedDate = ('0' + fechaActual.getDate()).slice(-2) + '/' + ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '/' + fechaActual.getFullYear();
document.getElementById('fechaInclu').textContent = formattedDate;

document.addEventListener('DOMContentLoaded', function() {
    someDataId = 1;
    fetchDataset(someDataId);  // Replace 'someDataId' with a specific dataset ID you want to load initially
});



function mostraOcultarI(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];
    var container3 = document.getElementsByClassName("cuadroInfoR")[0];

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
// document.addEventListener("DOMContentLoaded", function() {

//     const container = document.getElementById("container");
//     const comentarios = document.getElementById("comentarios");
//     const numberOfSquares = 3; // Specify the number of squares you want

//     // Function to create squares
//     function createSquares(containerElement) {
//         for (let i = 0; i < numberOfSquares; i++) {
//             const dataset = document.createElement("div");
//             dataset.classList.add("dataset");

//             // Add your content here
//             if (containerElement === container) {
//                 dataset.innerHTML = `
//                     <div class="cuadroDats">
//                         <form action="">
//                             <h2 class="tittleM">Data Set</h2>
//                             <label>
//                                 <i class="fa-solid fa-file-image"></i>
//                             </label>
//                             <div class="infoIO">
//                                 <h3 class="solDatos">Username: </h3>  
//                                 <output id="username" class="iDat">NombreUsuario</output>
//                             </div>
//                             <div class="infoIO">
//                                 <h3 class="solDatos">Descripcion:</h3>
//                                 <output id="Descripcion" class="iDat">texto</output>
//                             </div>
//                             <div class="infoIO">
//                                 <h3 class="solDatos">Fecha de inclusion:</h3>
//                                 <output id="fecha" class="iDat">dd/mm/yyyy</output>
//                             </div>
//                             <div class="infoIO">
//                                 <h3 class="solDatos">documento subido:</h3>
//                                 <output id="fecha" class="iDat">documento</output>
//                             </div>
//                         </form>
//                     </div>
//                 `;
//             } else if (containerElement === comentarios) {
//                 dataset.innerHTML = `
//                     <div class="cuadroDats">
//                         <form action="">
//                             <h4 class="tittleM">Comentarios</h4>
//                             <div class="infoIO">
//                                 <h4 class="solDatos">Username: </h4>  
//                                 <output id="username" class="iDat">Comentario x</output>
//                             </div>
//                         </form>
//                     </div>
//                 `;
//             }

//             containerElement.appendChild(dataset);
//         }
//     }

//     // Create squares for both container and comentarios
//     createSquares(container);
//     createSquares(comentarios);
// });





