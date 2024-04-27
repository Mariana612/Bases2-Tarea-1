var fechaActual = new Date();
var formattedDate = ('0' + fechaActual.getDate()).slice(-2) + '/' + ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '/' + fechaActual.getFullYear();
document.getElementById('fechaInclu').textContent = formattedDate;


window.onload = function() {
    var dato = sessionStorage.getItem('idUsuario'); // Obtienes el dato desde sessionStorage
    console.log(dato); // Usas el dato como necesites, por ejemplo, mostrarlo en consola

    // Opcional: limpiar el sessionStorage si el dato ya no es necesario
    sessionStorage.removeItem('idUsuario');
};



function mostraOcultarP(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    

    if(container4.style.display != "none" || container2.style.display != "none"){
        container2.style.display = "none";
        container3.style.display = "none";
        container4.style.display = "none";
    }

    if(container1.style.display == "none"){
        container1.style.display = "flex";
    }else{
        container1.style.display = "none";
    }
}



function mostraOcultarR(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    

    if(container4.style.display != "none" || container1.style.display != "none"){
        container1.style.display = "none";
        container3.style.display = "none";
        container4.style.display = "none";
    }

    if(container2.style.display == "none"){
        container2.style.display = "flex";
    }else{
        container2.style.display = "none";
    }
}


function mostraOcultarI(){
    var container1 = document.getElementsByClassName("perfil")[0];

    var container2 = document.getElementsByClassName("dataset")[0];

    var container3 = document.getElementsByClassName("barraBus")[0];
    var container4 = document.getElementsByClassName("verDataSet")[0];

    

    if(container1.style.display != "none" || container2.style.display != "none"){
        container1.style.display = "none";
        container2.style.display = "none";
    }

    if(container4.style.display == "none"){
        container4.style.display = "flex";
        container3.style.display = "flex";
    }else{
        container4.style.display = "none";
        container3.style.display = "none";
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





