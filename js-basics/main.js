document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("container");
    const comentarios = document.getElementById("comentarios");
    const numberOfSquares = 3; // Specify the number of squares you want

    // Function to create squares
    function createSquares(containerElement) {
        for (let i = 0; i < numberOfSquares; i++) {
            const dataset = document.createElement("div");
            dataset.classList.add("dataset");

            // Add your content here
            if (containerElement === container) {
                dataset.innerHTML = `
                    <div class="cuadroDats">
                        <form action="">
                            <h2 class="tittleM">Data Set</h2>
                            <label>
                                <i class="fa-solid fa-file-image"></i>
                            </label>
                            <div class="infoIO">
                                <h3 class="solDatos">Username: </h3>  
                                <output id="username" class="iDat">NombreUsuario</output>
                            </div>
                            <div class="infoIO">
                                <h3 class="solDatos">Descripcion:</h3>
                                <output id="Descripcion" class="iDat">texto</output>
                            </div>
                            <div class="infoIO">
                                <h3 class="solDatos">Fecha de inclusion:</h3>
                                <output id="fecha" class="iDat">dd/mm/yyyy</output>
                            </div>
                            <div class="infoIO">
                                <h3 class="solDatos">documento subido:</h3>
                                <output id="fecha" class="iDat">documento</output>
                            </div>
                        </form>
                    </div>
                `;
            } else if (containerElement === comentarios) {
                dataset.innerHTML = `
                    <div class="cuadroDats">
                        <form action="">
                            <h4 class="tittleM">Comentarios</h4>
                            <div class="infoIO">
                                <h4 class="solDatos">Username: </h4>  
                                <output id="username" class="iDat">Comentario x</output>
                            </div>
                        </form>
                    </div>
                `;
            }

            containerElement.appendChild(dataset);
        }
    }

    // Create squares for both container and comentarios
    createSquares(container);
    createSquares(comentarios);
});