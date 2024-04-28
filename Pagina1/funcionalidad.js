var boton = document.getElementById("btnOlvidaC");
var numero = 3;

    boton.addEventListener("click", function() {
        sessionStorage.setItem('idUsuario', numero);
        window.location.href = "Pagina3/index.html";
    });


function mostraOcultarI(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    container1.style.display = "flex";
    container2.style.display = "none";
}


function mostraOcultarR(){
    var container1 = document.getElementsByClassName("cuadroInfoI")[0];
    var container2 = document.getElementsByClassName("cuadroInfoR")[0];

    container1.style.display = "none";
    container2.style.display = "flex";
}


