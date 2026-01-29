document.addEventListener('DOMContentLoaded', ()=>{
    const dadosCompra = JSON.parse(localStorage.getItem('nuitfest_checkout'));
    const resumoArea = document.querySelector('.resume-payment')

    if(dadosCompra){
        resumoArea.innerHTML = `
            <div class = "ticket-container">
                <div class= "ticket-header">
                    <img src= "${dadosCompra.imagem}">
                    <div class = "event-info-resumo">
                        <h3>${dadosCompra.evento}</h3>
                        <p><i class="bi bi-calendar3"></i> ${dadosCompra.data}</p>
                    </div>
                </div>

                <div class="ticket-body">
                    <p class="label-resumo">RESUMO DO PEDIDO</p>
                    <div class="item-resumo">
                        <span><strong>Ingressos:</strong>     ${dadosCompra.setor}</span>
                        <span> ${dadosCompra.preco}</span>
                    </div>
                    <div class="item-resumo">
                        <span>Taxas</span>  
                        <span>R$ 0,00</span>
                    </div>
                </div>
                
                <div class="ticket-footer">
                    <div class="total-resumo">
                        <span><strong>TOTAL:</strong></span>
                        <span>${dadosCompra.preco}</span>
                    </div>
                </div>
            </div>
        `
    }
})

const radioCard = document.getElementById('method-card');
const radioPix = document.getElementById('method-pix');
const formCard = document.getElementById('form-card');
const formPix = document.getElementById('form-pix');
const btnFinalizar = document.getElementById('btn-finalizar');

radioCard.name = "payment";
radioPix.name = "payment";

function alternarMetodo(){
    if(radioCard.checked){
        formCard.classList.remove('hidden');
        formPix.classList.add('hidden');
    } else {
        formCard.classList.add('hidden');
        formPix.classList.remove('hidden');
    }
}

radioCard.addEventListener('change', alternarMetodo);
radioPix.addEventListener('change', alternarMetodo);

btnFinalizar.addEventListener("click", (e)=>{
    if(radioCard.checked){
        const numero = document.getElementById('card-number').value;
        const nome = document.getElementById('card-name').value;
        const validade = document.getElementById('card-expiry').value;
        const cvv = document.getElementById('card-cvv').value;
        
     if(numero.length < 13){
            alert("preencha com os numeros do seu cartão")
        }


        if(!numero || !nome || !validade || !cvv){
            alert("preencha os campos obrigatorios");
            return;
        }

       
        
    }
})


const backHome = document.querySelector(".back-home")

backHome.addEventListener("click",()=>{
    window.location.href = "../home/home.html"
})