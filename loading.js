
//funções responsável por mostrar ao usuário uma resposta de carregamento do login
function showLoading(){
const loaderScreen = document.createElement("div");
loaderScreen.classList.add("loader-screen");

const loading = document.createElement("div");
loading.classList.add("loader");

loaderScreen.appendChild(loading);

document.body.appendChild(loaderScreen);
}

function hidenLoading(){
    const loadings = document.getElementsByClassName("loader-screen")
    if(loadings.length){
        loadings[0].remove();
    }

}