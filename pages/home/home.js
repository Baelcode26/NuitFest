

document.addEventListener('DOMContentLoaded', () => {

  const profile = document.querySelector('.profile');
  const menuArea = document.querySelector('.menu-area');
  const closePurchaseArea = document.querySelector('.close-purchase-area');
  const purchaseArea = document.querySelector('.event-purchase-area');
  const grid = document.getElementById('event-grid');

//abrir e fechar menu do header
  profile.addEventListener('click', (e) => {
    e.stopPropagation();
    menuArea.style.display = 'flex';
    setTimeout(() => menuArea.classList.add('ativo'), 10);
    profile.style.display = 'none';
  });
//fechar o menu ao clicar fora dele 
  document.addEventListener('click', (e) => {
    if (!menuArea.contains(e.target) && !profile.contains(e.target)) {
      menuArea.classList.remove('ativo');
      setTimeout(() => {
        menuArea.style.display = 'none';
        profile.style.display = 'flex';
      }, 300);
    }
  });

  //abrir e fechar popup com animaçao
  function openPurchase() {

    purchaseArea.style.display = 'block';
    void purchaseArea.offsetWidth;
    purchaseArea.classList.add('ativo');
  }

  function closePurchase() {
    purchaseArea.classList.remove('ativo');
    setTimeout(() => {
      purchaseArea.style.display = 'none';
    }, 300); 
  }

  // fechar popup pelo X
  closePurchaseArea.addEventListener('click', (e) => {
    e.stopPropagation();
    closePurchase();
  });

  // fechar clicando fora do popup
  document.addEventListener('click', (e) => {
    const aberto = purchaseArea.classList.contains('ativo');
    if (!aberto) return;

    const clicouDentro = purchaseArea.contains(e.target);
    const clicouEmCard = !!e.target.closest('.img-area');

    if (!clicouDentro && !clicouEmCard) {
      closePurchase();
    }
  });

 //carrega os eventos do json e cria os elementos
 // Variável global para guardar os eventos e facilitar o acesso
let listaDeEventosGlobal = [];

//carrega os eventos disponiveis no json
async function carregarEventos() {
    try {
        const resposta = await fetch("/pages/home/events.json");
        const eventos = await resposta.json();
        listaDeEventosGlobal = eventos; 

        grid.innerHTML = ""; 
        eventos.forEach(evento => {
            const div = document.createElement("div");
            div.classList.add("img-area");
            div.innerHTML = `
                <img src="${evento.image}" alt="${evento.name}">
                <div class="img-info">
                    <h3 class="date">${evento.date}</h3>
                    <h1 class="event-name">${evento.name}</h1>
                    <p class="event-description">${evento.description}</p>
                </div>
            `;
            grid.appendChild(div);
        });
    } catch (erro) {
        console.error("Erro ao carregar eventos:", erro);
    }
}

// 
grid.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = e.target.closest('.img-area');
    if (!card) return;

    const nomeEventoClicado = card.querySelector('.event-name').textContent;

    const eventoEncontrado = listaDeEventosGlobal.find(ev => ev.name === nomeEventoClicado);

    if (eventoEncontrado) {
        const sidebar = document.querySelector('.modal-sidebar-sectors');
        const imgArea = document.querySelector('.modal-img-area')
        const detailsArea = document.querySelector('.modal-details-area');

        
        // Limpa a sidebar e mantém apenas o título
        sidebar.innerHTML = '<h2>Selecione um setor</h2>';

        imgArea.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.5)), url('${eventoEncontrado.image}')`;
        imgArea.style.backgroundSize = 'cover';
        imgArea.style.backgroundPosition = 'center';


        //Adiciona as informacoes do pop up dinamicamente
            imgArea.innerHTML = `
                <div class="event-header-content">
                  <div class = "event-text-info">
                    <h1>${eventoEncontrado.name}</h1>
                    <p><i class="bi bi-calendar3"></i> ${eventoEncontrado.date}</p>
                    <p><i class="bi bi-clock"></i> ${eventoEncontrado.horario}</p>
                    <p><i class="bi bi-geo-alt"></i> ${eventoEncontrado.location}</p>
                    <span class="badge-parcela">Parcele em até 12x</span>
                  </div>

                  <div class= "event-image-banner">
                    <img src="${eventoEncontrado.image}">
                  </div>
                </div>
            `;
            detailsArea.innerHTML = `
        <div class="description-container">
            <h3>Descrição do evento</h3>
            <p>${eventoEncontrado.detailDescription}</p>
            <p class="info-importante"><strong>INFORMAÇÕES IMPORTANTES:</strong><br>
            LOCAL: ${eventoEncontrado.location}</p>
        </div>
        <div class="purchase-card">
            <div class="purchase-info">
                <h2 id = "price-display"></h2>
                <span>Pague em até 12x</span>
            </div>
            <button class="btn-buy-now">Comprar ingressos</button>
        </div>
    `;

     const btnBuy = document.querySelector('.btn-buy-now')

btnBuy.addEventListener('click', () => {
          const setorSelecionado = document.querySelector('.sector-item-card.selected');

          if (!setorSelecionado) {
            alert("Por favor, selecione um setor antes de continuar!");
            return
          }

          const dadosCompra = {
            evento: eventoEncontrado.name,
            data: eventoEncontrado.date,
            local: eventoEncontrado.location,
            imagem: eventoEncontrado.image,
            setor: setorSelecionado.querySelector('h4').textContent,
            preco: setorSelecionado.querySelector('p').textContent
          }

          localStorage.setItem('nuitfest_checkout', JSON.stringify(dadosCompra));

          window.location.href = "../checkout/checkout.html"
        })


     

        // Cria os setores dinamicamente
        eventoEncontrado.sectors.forEach(setor => {
            const divSetor = document.createElement('div');
            divSetor.classList.add('sector-item-card'); // Criaremos o CSS para isso
            
            divSetor.innerHTML = `
                <div class="sector-info">
                    <h4>${setor.name}</h4>
                    <p>R$ ${setor.price.toFixed(2).replace('.', ',')}</p>
                </div>
            `;

            divSetor.addEventListener('click', () =>{
              document.querySelectorAll('.sector-item-card').forEach(card => {
                card.classList.remove('selected')
              });
              divSetor.classList.add('selected');

              const priceDisplay = document.getElementById('price-display');
              priceDisplay.textContent = `R$ ${setor.price.toFixed(2).replace('.', ',')}`;
              priceDisplay.style.color = "#c1288e"
            })

            sidebar.appendChild(divSetor);
        });

        // Abre o popup
        openPurchase();
    }
});

carregarEventos();

//logout do usuario
  window.logout = function() {
    firebase.auth().signOut().then(()=>{
      window.location.href = "../../index.html";
    }).catch(()=>{
      alert("erro ao fazer logout do usuario");
    });
  };


  document.querySelectorAll('header nav ul li, .section-text-area a').forEach(elemento => {
    elemento.addEventListener('click', (e) => {
      e.preventDefault();

      let nome = elemento.textContent.trim().toLowerCase();
      if (nome.includes('ver eventos')) nome = 'eventos';

      const section = document.querySelector(`#${nome}`) || document.querySelector(`.${nome}-area`);
      section?.scrollIntoView({ behavior: 'smooth' });

      if (elemento.tagName === 'LI') {
        document.querySelectorAll('header nav ul li').forEach(item => item.classList.remove('active'));
        elemento.classList.add('active');
      }
    });
  });

}); 
