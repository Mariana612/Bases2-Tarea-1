var fechaActual = new Date();
var formattedDate = ('0' + fechaActual.getDate()).slice(-2) + '/' + ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '/' + fechaActual.getFullYear();
document.getElementById('fechaInclu').textContent = formattedDate;



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

async function insertarDataSet(){
        
        const username = document.getElementById("username").value;
        const descripcionOutput = document.getElementById("Descripcion").value;
        
        const requestBody = {
            nombre: username,
            photoId: 10,
            dataId:10,
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


async function mostrarDataSet(){
        
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








